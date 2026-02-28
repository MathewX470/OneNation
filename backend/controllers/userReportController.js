const UserReport = require("../models/userReports");
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
 const locationName = await fetchNameOfLoc(lat, lng);
    const report = await UserReport.create({
      userId: req.user._id,
      subject,
      description,
      urgency,
      location: {
        lat,
        lng,
      },
      locationName,
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

const fetchNameOfLoc = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "MyCommunityApp/1.0" // Always include this to avoid being blocked
        }
      }
    );
    const data = await response.json();
    if (!data || !data.address) return "Location Unknown";

    const addr = data.address;

    // 1. Specific Area (The "Most Local" Name)
    const localArea = 
      addr.suburb ||        // Best for Cities (e.g., Sector 21, Indiranagar)
      addr.neighbourhood || // Best for Urban areas (e.g., Vazhayil)
      addr.village ||       // Best for Rural (e.g., Chelachuvadu)
      addr.residential ||   // Housing colonies
      addr.hamlet ||        // Small clusters
      addr.road;            // If it's on a highway/street

    // 2. District/City (The "Context" Name)
    const contextArea = 
      addr.city ||          // Major cities (Gurgaon, Kochi)
      addr.town ||          // Smaller towns (Mavelikkara)
      addr.city_district || // Manesar, etc.
      addr.state_district;  // District level (Alappuzha, Idukki)

    // 3. Logic to combine them nicely
    if (localArea && contextArea && localArea !== contextArea) {
      return `${localArea}, ${contextArea}`;
    }

    return localArea || contextArea || addr.state || "Unknown Area";

  } catch (error) {
    console.error("Geocoding error:", error);
    return "Location unavailable";
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


// ================= GET DEPARTMENT ADMIN REPORTS =================
const getDepartmentReports = async (req, res) => {
  try {
    // department comes from logged in admin (JWT)
    const department = req.user.department;

    const reports = await UserReport.find({
      status: "In Progress",
      adminDepartment: department,
    })
      .populate("userId", "name email")
      .populate("middleManID", "name email")
      .sort({ createdAt: -1 });

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

// ================= GET SINGLE REPORT =================
const getSingleReport = async (req, res) => {
  try {
    const report = await UserReport.findById(req.params.id)
      .populate("userId", "name email")
      .populate("middleManID", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.json({
      success: true,
      report,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= UPDATE STATUS =================
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const report = await UserReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    await report.save();

    res.json({
      success: true,
      message: "Status updated",
      report,
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
  getDepartmentReports,
  getSingleReport,
  updateReportStatus
};