const UserReport = require("../models/userReportModel");
const cloudinary = require("../config/cloudinary");

// ================= CREATE REPORT =================
const createReport = async (req, res) => {
  try {
    const { subject, description, urgency = "Medium", lat, lng, petition } =
      req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required",
      });
    }

    let photoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "onenation_reports",
      });

      photoUrl = result.secure_url;
    }

    const report = await UserReport.create({
      userId: req.user._id,
      subject,
      description,
      urgency,
      location: {
        lat,
        lng,
      },
      petition,
      photo: photoUrl,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET MY REPORTS =================
const getMyReports = async (req, res) => {
  try {
    const reports = await UserReport.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reports,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= GET NEARBY REPORTS =================
const getNearbyReports = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location required",
      });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    const reports = await UserReport.find({
      "location.lat": {
        $gte: latNum - 0.03,
        $lte: latNum + 0.03,
      },
      "location.lng": {
        $gte: lngNum - 0.03,
        $lte: lngNum + 0.03,
      },
      petition: true,
    });

    res.json({
      success: true,
      reports,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= UPVOTE REPORT =================
const toggleUpvote = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await UserReport.findById(reportId);

    if (!report)
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });

    report.upvotes += 1;
    await report.save();

    res.json({
      success: true,
      upvotes: report.upvotes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createReport,
  getMyReports,
  getNearbyReports,
  toggleUpvote,
};