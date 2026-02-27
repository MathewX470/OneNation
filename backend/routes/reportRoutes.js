const express = require("express");
const router = express.Router();
const { getDepartmentReports } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/roleMiddleware");

router.get(
  "/admin",
  protect,
  authorize("department_admin"),
  getDepartmentReports
);

module.exports = router;