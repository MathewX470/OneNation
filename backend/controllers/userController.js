const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpEmail");

let otpStore = {}; // In-memory OTP store

// ================= SEND OTP =================
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= VERIFY OTP =================
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record)
    return res.status(400).json({ success: false, message: "No OTP found" });

  if (record.expires < Date.now())
    return res.status(400).json({ success: false, message: "OTP expired" });

  if (record.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  delete otpStore[email];

  res.json({ success: true, message: "OTP verified" });
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { fullname, phoneNo, email, password, lat, lng, pincode, aadhar } =
      req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNo }],
    });

    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Email or phone already registered",
      });
    
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPasswordRegex.test(password))
      return res.status(400).json({
        success: false,
        message:
          "Password must contain 8 characters, uppercase, lowercase, number and special character",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      phoneNo,
      email,
      password: hashedPassword,
      lat,
      lng,
      pincode,
      aadhar,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    const user = await User.findOne({ phoneNo });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser,
};