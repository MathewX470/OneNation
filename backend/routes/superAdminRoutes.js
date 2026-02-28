const express = require("express");
const router = express.Router();
const {
  getDepartmentAdmins,
  createDepartmentAdmin,
  updateDepartmentAdmin,
  deleteDepartmentAdmin,
  getMiddlemen,
  createMiddleman,
  deleteMiddleman,
} = require("../controllers/superAdminController");

const { getAllReports, updateReportStatus, assignReportToMiddleman, deleteReport } = require("../controllers/superAdminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Only super_admin
router.use(protect, authorize("super_admin"));

router.get("/department-admins", getDepartmentAdmins);
router.post("/department-admins", createDepartmentAdmin);
router.put("/department-admins/:id", updateDepartmentAdmin);
router.delete("/department-admins/:id", deleteDepartmentAdmin);

router.get("/middlemen", getMiddlemen);
router.post("/middlemen", createMiddleman);
router.delete("/middlemen/:id", deleteMiddleman);

// === NEW REPORTS ROUTES ===
router.get("/reports", getAllReports);
router.put("/reports/:id/status", updateReportStatus);
router.put("/reports/:id/assign", assignReportToMiddleman);
router.delete("/reports/:id", deleteReport);

module.exports = router;