const BloodRequest = require("../models/BloodRequest");

exports.createBloodRequest = async (req, res) => {
  try {
    const { hospitalId, bloodGroup, unitsRequired, urgencyLevel } = req.body;

    const request = await BloodRequest.create({
      hospital: hospitalId,
      bloodGroup,
      unitsRequired,
      urgencyLevel
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHospitalRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      hospital: req.params.hospitalId
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};