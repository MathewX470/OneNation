const mongoose = require("mongoose");

const donorVerificationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or Donor model if separate
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  bloodGroup: {
    type: String,
    required: true
  },
  state: String,
  district: String,

  status: {
    type: String,
    enum: [
      "PENDING",
      "APPOINTMENT_SCHEDULED",
      "VERIFIED",
      "REJECTED"
    ],
    default: "PENDING"
  },

  appointmentDate: Date,
  verifiedAt: Date

}, { timestamps: true });

module.exports = mongoose.model("DonorVerification", donorVerificationSchema);