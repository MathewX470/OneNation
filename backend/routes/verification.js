const express = require("express");
const router = express.Router();
const DonorVerification = require("../models/DonorVerification");
const User = require("../models/userModel"); 

// Schedule appointment
router.put("/:id/schedule", async (req, res) => {
  try {
    const { appointmentDate } = req.body;

    const verification = await DonorVerification.findByIdAndUpdate(
      req.params.id,
      {
        appointmentDate: new Date(appointmentDate), // ✅ convert to Date
        status: "APPOINTMENT_SCHEDULED"
      },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(verification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATED VERIFY ROUTE
router.put("/:id/verify", async (req, res) => {
  try {
    // 1️⃣ Update verification status
    const verification = await DonorVerification.findByIdAndUpdate(
      req.params.id,
      {
        status: "VERIFIED",
        verifiedAt: new Date()
      },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 2️⃣ Update user as verified donor
    await User.findByIdAndUpdate(
      verification.donor,
      { isVerifiedDonor: true }
    );

    res.json({
      message: "Donor verified successfully",
      verification
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;