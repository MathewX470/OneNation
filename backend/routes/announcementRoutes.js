const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");

const { protect, authorize } = require("../middleware/roleMiddleware");

/* Only Department Admin Can Create */
router.post(
  "/",
  protect,
  authorize("department_admin"),
  createAnnouncement
);

/* Public or Protected for citizens */
router.get("/", getAnnouncements);

module.exports = router;