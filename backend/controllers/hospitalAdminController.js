const Hospital = require("../models/Hospital");

// GET all hospitals
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, hospitals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE hospital account
const createHospital = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await Hospital.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hospital = await Hospital.create({
      name,
      email,
      password,
      phone,
      location: {
        type: "Point",
        coordinates: [0, 0], // placeholder — hospital updates this from their own portal
      },
    });

    const hospitalResponse = hospital.toObject();
    delete hospitalResponse.password;

    res.status(201).json({ success: true, hospital: hospitalResponse });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TOGGLE verify hospital
const toggleHospitalVerification = async (req, res) => {
  try {
    const { isVerified } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select("-password");

    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital not found" });
    }

    res.json({ success: true, hospital });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE hospital
const deleteHospital = async (req, res) => {
  try {
    await Hospital.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Hospital deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllHospitals,
  createHospital,
  toggleHospitalVerification,
  deleteHospital,
};
