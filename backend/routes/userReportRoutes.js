const express = require("express");
const {
  createReport,
  getMyReports,
  getNearbyReports,
  toggleUpvote,
} = require("../controllers/userReportController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", protect, upload.single("photo"), createReport);
router.get("/my", protect, getMyReports);
router.get("/nearby", protect, getNearbyReports);
router.put("/upvote/:reportId", protect, toggleUpvote);

module.exports = router;