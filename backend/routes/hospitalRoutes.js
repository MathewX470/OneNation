const express = require("express");
const jwt = require("jsonwebtoken");
const Hospital = require("../models/Hospital");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/userModel");
const { protectHospital, protectDonor } = require("../middleware/authMiddleware");
const DonorVerification = require("../models/DonorVerification");
const router = express.Router();

/* ================= LOGIN ================= */

 router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await hospital.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: hospital._id, role: "hospital" },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      hospital
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



/* ================= CREATE BLOOD REQUEST ================= */
router.post("/request", protectHospital, async (req, res) => {
  try {
    const { bloodGroup, unitsRequired, urgencyLevel } = req.body;

    const newRequest = await BloodRequest.create({
      hospital: req.hospital._id,
      bloodGroup,
      unitsRequired,
      urgencyLevel
    });

    res.status(201).json(newRequest);

  } catch {
    res.status(500).json({ message: err.message });
  }
});


/* ================= GET HOSPITAL REQUESTS ================= */
router.get("/requests", protectHospital, async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      hospital: req.hospital._id
    }).sort({ createdAt: -1 });

    res.json(requests);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/verification", protectDonor, async (req, res) => {
  try {
    const { bloodGroup, state, district, hospital } = req.body;

    const verification = await DonorVerification.create({
      donor: req.user._id,
      hospital,
      bloodGroup,
      state,
      district
    });

    res.status(201).json(verification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/verification-requests", protectHospital, async (req, res) => {
  try {
    const requests = await DonorVerification.find({
      hospital: req.hospital._id,
      status: { $in: ["PENDING", "APPOINTMENT_SCHEDULED"] }
    })
    .populate("donor", "name email phone")
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/verification/:id/schedule", protectHospital, async (req, res) => {
  try {
    const { appointmentDate } = req.body;

    const verification = await DonorVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ message: "Request not found" });
    }

    verification.status = "APPOINTMENT_SCHEDULED";
    verification.appointmentDate = appointmentDate;

    await verification.save();

    res.json(verification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/verification/:id/verify", protectHospital, async (req, res) => {
  try {
    const verification = await DonorVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update verification status
    verification.status = "VERIFIED";
    verification.verifiedAt = new Date();
    await verification.save();

    // 🔥 THIS IS WHERE YOU PUT IT
    await User.findByIdAndUpdate(
      verification.donor,
      { isVerifiedDonor: true }
    );

    res.json(verification);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;