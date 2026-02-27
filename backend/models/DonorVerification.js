const mongoose = require("mongoose");

const donorVerificationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  },
  state: String,
  district: String,
  healthDeclaration: {
    type: Boolean,
    required: true,
    default: false
  },

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
  verifiedAt: Date,
  rejectionReason: {
    type: String,
    default: null
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    default: null
  }

}, { timestamps: true });

module.exports = mongoose.model("DonorVerification", donorVerificationSchema);