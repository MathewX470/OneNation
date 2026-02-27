const UserReport = require("../models/UserReport");

exports.getDepartmentReports = async (req, res) => {
  try {
    const department = req.user.department; // from JWT

    const reports = await UserReport.find({
      status: "In Progress",          // Only ongoing
      adminDepartment: department,    // Only that department
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};