const express = require("express");
const {
  createReport,
  getMyReports,
  getNearbyReports,
  toggleUpvote,
  getDepartmentReports,
  getSingleReport,
  updateReportStatus
} = require("../controllers/userReportController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("photo"), createReport);
router.get("/admin", protect, getDepartmentReports);
router.get("/my", protect, getMyReports);         // ✅ moved above /:id
router.get("/nearby", protect, getNearbyReports); // ✅ moved above /:id
router.put("/upvote/:reportId", protect, toggleUpvote);
router.put("/:id/status", protect, updateReportStatus);
router.get("/:id", protect, getSingleReport);     // ✅ now last

module.exports = router;