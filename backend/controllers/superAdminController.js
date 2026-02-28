const AdminStaff = require("../models/AdminStaff");
const bcrypt = require("bcryptjs");

const UserReport = require("../models/userReport"); // ← make sure path is correct

// ================= REPORTS =================
const getAllReports = async (req, res) => {
  try {
    const reports = await UserReport.find()
      .populate("userId", "name email")
      .populate("middleManID", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await UserReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email").populate("middleManID", "name email");

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const assignReportToMiddleman = async (req, res) => {
  try {
    const { middleManID } = req.body;
    const report = await UserReport.findByIdAndUpdate(
      req.params.id,
      { middleManID },
      { new: true }
    ).populate("userId", "name email").populate("middleManID", "name email");

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteReport = async (req, res) => {
  try {
    await UserReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  // ... existing exports
  getAllReports,
  updateReportStatus,
  assignReportToMiddleman,
  deleteReport,
};

// GET ALL
const getDepartmentAdmins = async (req, res) => {
  const admins = await AdminStaff.find({ role: "department_admin" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({ success: true, admins });
};

// CREATE
const createDepartmentAdmin = async (req, res) => {
  const { name, email, password, department } = req.body;

  const exists = await AdminStaff.findOne({ email });
  if (exists)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await AdminStaff.create({
    name,
    email,
    password: hashedPassword,
    role: "department_admin",
    department,
  });

  res.status(201).json({ success: true, admin });
};

// UPDATE
const updateDepartmentAdmin = async (req, res) => {
  const { name, department, isActive } = req.body;

  const admin = await AdminStaff.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: "Not found" });

  admin.name = name || admin.name;
  admin.department = department || admin.department;
  admin.isActive = isActive ?? admin.isActive;

  await admin.save();

  res.json({ success: true, admin });
};

// DELETE
const deleteDepartmentAdmin = async (req, res) => {
  await AdminStaff.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};


// ================= GET MIDDLEMEN =================
const getMiddlemen = async (req, res) => {
  try {
    const middlemen = await AdminStaff.find({
      role: "middleman",
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      middlemen,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= CREATE MIDDLEMAN =================
const createMiddleman = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await AdminStaff.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const middleman = await AdminStaff.create({
  name,
  email,
  password: hashedPassword,
  role: "middleman",
});

    res.status(201).json({
      success: true,
      middleman,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= DELETE MIDDLEMAN =================
const deleteMiddleman = async (req, res) => {
  try {
    await AdminStaff.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Middleman deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = {
  // Department Admin
  getDepartmentAdmins,
  createDepartmentAdmin,
  updateDepartmentAdmin,
  deleteDepartmentAdmin,

  // Middlemen
  getMiddlemen,
  createMiddleman,
  deleteMiddleman,
};