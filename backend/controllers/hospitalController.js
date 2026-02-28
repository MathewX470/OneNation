const Hospital     = require("../models/Hospital");
const BloodRequest = require("../models/BloodRequest");
//const User         = require("../models/User");
const Notification = require("../models/Notification");
const DonorVerification = require("../models/DonorVerification");
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

exports.createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, unitsRequired, urgencyLevel } = req.body;

    console.log("1. Request body:", { bloodGroup, unitsRequired, urgencyLevel });
    console.log("2. Hospital from token:", req.hospital);

    const request = await BloodRequest.create({
      hospital: req.hospital._id,
      bloodGroup,
      unitsRequired,
      urgencyLevel,
    });

    console.log("3. BloodRequest created:", request._id);

    const matchingVerifications = await DonorVerification.find({
      bloodGroup,
      status: "VERIFIED",
    }).select("donor");

    console.log("4. Matching verified donors found:", matchingVerifications.length);
    console.log("5. Donor verifications:", JSON.stringify(matchingVerifications));

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

      console.log("6. Notifications to insert:", JSON.stringify(notifications));

      const inserted = await Notification.insertMany(notifications);
      console.log("7. Notifications inserted:", inserted.length);
    } else {
      console.log("6. SKIPPED - No matching donors found for blood group:", bloodGroup);
    }

    res.status(201).json(request);
  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
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