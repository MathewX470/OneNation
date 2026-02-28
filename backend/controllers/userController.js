const User = require("../models/userModel");
const DonorVerification = require("../models/DonorVerification");
const Hospital = require("../models/Hospital");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpEmail");
const Notification = require("../models/Notification");

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

// ================= GET HOSPITALS BY LOCATION =================
// GET /api/users/hospitals?state=Kerala&district=Trivandrum
const getHospitalsByLocation = async (req, res) => {
  try {
    const { state, district } = req.query;

    if (!state || !district)
      return res.status(400).json({
        success: false,
        message: "Please provide both state and district",
      });

    const hospitals = await Hospital.find({
      state: { $regex: new RegExp(`^${state}$`, "i") },
      district: { $regex: new RegExp(`^${district}$`, "i") },
      isVerified: true,
    }).select("_id name address phone");

    res.status(200).json({ success: true, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= SUBMIT DONOR VERIFICATION REQUEST =================
// POST /api/users/donor/verify
const submitDonorVerification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bloodGroup, state, district, hospital, healthDeclaration } = req.body;

    if (!bloodGroup || !state || !district || !hospital || !healthDeclaration)
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });

    // Check hospital exists and is approved
    const hospitalDoc = await Hospital.findOne({ _id: hospital, isVerified: true });
    if (!hospitalDoc)
      return res.status(404).json({
        success: false,
        message: "Selected hospital not found or not approved.",
      });

    // Block duplicate active requests
    const existing = await DonorVerification.findOne({
      donor: userId,
      status: { $in: ["PENDING", "APPOINTMENT_SCHEDULED", "VERIFIED"] },
    });

    if (existing)
      return res.status(409).json({
        success: false,
        message:
          existing.status === "VERIFIED"
            ? "You are already a verified donor."
            : "You already have a pending verification request.",
        status: existing.status,
      });

    const request = await DonorVerification.create({
      donor: userId,
      bloodGroup,
      state,
      district,
      hospital,
      healthDeclaration,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Verification request submitted successfully.",
      status: "PENDING",
      request,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET DONOR STATUS =================
// GET /api/users/donor/status
const getDonorStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const request = await DonorVerification.findOne({ donor: userId })
      .sort({ createdAt: -1 })
      .populate("hospital", "name address district state");

    if (!request)
      return res.status(200).json({ success: true, status: "Not Registered", request: null });

    res.status(200).json({ success: true, status: request.status, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CHANGE exports.getMyNotifications = async ...
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE exports.markNotificationRead = async ...
const markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE exports.markAllNotificationsRead = async ...
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= HOSPITAL: GET PENDING VERIFICATIONS =================
// GET /api/users/donor/pending
const getPendingVerifications = async (req, res) => {
  try {
    const hospitalId = req.user._id;

    const pendingRequests = await DonorVerification.find({
      hospital: hospitalId,
      status: "PENDING",
    })
      .populate("donor", "fullname email phoneNo")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, pendingRequests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= GET USER PROFILE =================
// GET /api/users/profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    const donorVerification = await DonorVerification.findOne({
      donor: userId,
    })
      .sort({ createdAt: -1 })
      .populate("hospital", "name address district state");

    res.status(200).json({
      success: true,
      user,
      donorVerification,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= UPDATE USER PROFILE =================
// PUT /api/users/profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      fullname,
      phoneNo,
      email,
      lat,
      lng,
      pincode,
      aadhar,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        phoneNo,
        email,
        lat,
        lng,
        pincode,
        aadhar,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ================= HOSPITAL: UPDATE DONOR VERIFICATION STATUS =================
// PUT /api/users/donor/verify/:requestId
const updateDonorVerificationStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, rejectionReason, appointmentDate } = req.body;
    const hospitalId = req.user._id;

    const allowed = ["APPOINTMENT_SCHEDULED", "VERIFIED", "REJECTED"];
    if (!allowed.includes(status))
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`,
      });

    const request = await DonorVerification.findOne({
      _id: requestId,
      hospital: hospitalId,
    });

    if (!request)
      return res.status(404).json({
        success: false,
        message: "Verification request not found.",
      });

    request.status = status;
    request.verifiedBy = hospitalId;
    if (status === "VERIFIED") {
      request.verifiedAt = new Date();

      await User.findByIdAndUpdate(request.donor, {
        isVerifiedDonor: true,
      });
    }
    if (status === "APPOINTMENT_SCHEDULED" && appointmentDate)
      request.appointmentDate = new Date(appointmentDate);
    if (status === "REJECTED" && rejectionReason){
      await User.findByIdAndUpdate(request.donor, {
        isVerifiedDonor: false,
      });
      request.rejectionReason = rejectionReason;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `Donor status updated to ${status}.`,
      status,
      request,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser,
  getHospitalsByLocation,
  submitDonorVerification,
  getDonorStatus,
  getPendingVerifications,
  updateDonorVerificationStatus,
  getUserProfile,
  updateUserProfile,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead
};