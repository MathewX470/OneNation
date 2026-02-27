const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Middleware to protect hospital routes
const protectHospital = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.hospital = await Hospital.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/profile", protectHospital, async (req, res) => {
  res.json(req.hospital);
});

router.put("/profile", protectHospital, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.hospital._id);

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    hospital.name = req.body.name || hospital.name;
    hospital.phone = req.body.phone || hospital.phone;
    hospital.state = req.body.state || hospital.state;
    hospital.district = req.body.district || hospital.district;

    if (req.body.lng && req.body.lat) {
      hospital.location = {
        type: "Point",
        coordinates: [
          Number(req.body.lng),
          Number(req.body.lat)
        ]
      };
    }

    if (req.body.password && req.body.password.length > 5) {
      hospital.password = req.body.password;
    }

    const updated = await hospital.save();

    res.json({
      message: "Profile updated successfully",
      hospital: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;