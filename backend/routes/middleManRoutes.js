const express = require("express");
const { logsMiddleMan, forwardReport,fetchAllReports, specificReport,cancelReport } = require("../controllers/middleManController");
const router = express.Router();

router.get("/logs", logsMiddleMan);
router.post("/forward-report", forwardReport);
router.get("/all-reports", fetchAllReports);
router.get("/report/:id", specificReport);
router.put("/decline-report", cancelReport);
module.exports = router;