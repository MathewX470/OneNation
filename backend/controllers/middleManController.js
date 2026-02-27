const MiddleMenLog = require("../models/middleMenLog");
const UserReport = require("../models/userReports");
const AdminStaff = require("../models/AdminStaff");

const logsMiddleMan = async (req, res) => {
  try {
    const logs = await MiddleMenLog.find(); // no populate since reportId is just a string
    return res.status(200).json(logs);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forwardReport = async (req, res) => {
  try {
    const { reportId, adminDepartment, middleManID } = req.body;

    if (!reportId || !adminDepartment || !middleManID) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch original report
    const report = await UserReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Validate middleman
    const findMiddleMan = await AdminStaff.findById(middleManID);
    if (!findMiddleMan) {
      return res.status(404).json({ message: "Middle man not found" });
    }

    // Update report
    report.status = "In Progress";
    report.adminDepartment = adminDepartment;
    await report.save();

    // Create log entry (only fields defined in schema)
    await MiddleMenLog.create({
      reportId: report._id.toString(),
      reportTitle: report.subject,
      forwardedTo: adminDepartment,
      time: new Date()
    });

    return res.status(200).json({ message: "Report forwarded successfully", report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchAllReports = async (req, res) => {
  try {
    const reports = await UserReport.find();
    return res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const specificReport = async (req, res) => {
  try {
    const report = await UserReport.findById(req.params.id);
    return res.status(200).json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { logsMiddleMan, forwardReport, fetchAllReports, specificReport };
