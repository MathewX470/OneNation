const Hospital     = require("../models/Hospital");
const BloodRequest = require("../models/BloodRequest");
const User         = require("../models/User");
const Notification = require("../models/Notification");
const jwt          = require("jsonwebtoken");

/* Generate JWT */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};


/* Hospital Login */
exports.loginHospital = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });

    if (hospital && await hospital.matchPassword(password)) {
      res.json({
        _id: hospital._id,
        name: hospital.name,
        token: generateToken(hospital._id)
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Create Blood Request (Protected) */
exports.createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, unitsRequired, urgencyLevel } = req.body;

    const request = await BloodRequest.create({
      hospital: req.hospital._id,
      bloodGroup,
      unitsRequired,
      urgencyLevel,
    });

    // Find verified donors with matching blood group
    const matchingVerifications = await DonorVerification.find({
      bloodGroup,
      status: "VERIFIED",
    }).select("donor");

    const donorUserIds = matchingVerifications.map((v) => v.donor);

    if (donorUserIds.length > 0) {
      const notifications = donorUserIds.map((userId) => ({
        user:      userId,
        title:     `🩸 Blood Request — ${bloodGroup}`,
        message:   `${req.hospital.name} needs ${unitsRequired} unit(s) of ${bloodGroup}. Urgency: ${urgencyLevel}.`,
        type:      "BLOOD_REQUEST",
        bloodGroup,
        requestId: request._id,
      }));

      await Notification.insertMany(notifications);
      // ✅ No socket emit — frontend will poll for new notifications
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* Get Hospital Requests (Protected) */
exports.getHospitalRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      hospital: req.hospital._id
    }).sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};