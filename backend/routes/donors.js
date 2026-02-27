const express = require("express");
const router = express.Router();
const DonorVerification = require("../models/DonorVerification");

// GET all verified donors
router.get("/available", async (req, res) => {
  try {
    const donors = await DonorVerification.find({
      status: "VERIFIED"
    })
      .populate({
        path: "donor",
        select: "fullname email phoneNo lat lng pincode isVerifiedDonor"
      })
      .select("bloodGroup state district verifiedAt");

    res.json(donors);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;