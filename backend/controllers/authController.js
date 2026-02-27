const Staff = require("../models/AdminStaff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const staff = await Staff.findOne({ email });

  if (!staff) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, staff.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: staff._id,
      role: staff.role,
      department: staff.department || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: staff.role,
    department: staff.department
  });
};