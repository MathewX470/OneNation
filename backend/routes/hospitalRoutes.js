const express = require("express");
const router = express.Router();
const {
  createBloodRequest,
  getHospitalRequests
} = require("../controllers/hospitalController");

router.post("/request", createBloodRequest);
router.get("/requests/:hospitalId", getHospitalRequests);

module.exports = router;