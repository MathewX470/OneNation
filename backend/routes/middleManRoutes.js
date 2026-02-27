const express = require("express");
const { logsMiddleMan, forwardReport,fetchAllReports, specificReport } = require("../controllers/middleManController");
const router = express.Router();

router.post("/logs", logsMiddleMan);
router.post("/forward-report", forwardReport);
router.get("/all-reports", fetchAllReports);
router.get("/report/:id", specificReport);
module.exports = router;