const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  bloodGroup: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  },
  unitsRequired: {
    type: Number,
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ["NORMAL", "URGENT", "CRITICAL"],
    default: "NORMAL"
  },
  status: {
    type: String,
    enum: ["OPEN", "PARTIAL", "FULFILLED", "CLOSED"],
    default: "OPEN"
  },
  radiusKm: {
    type: Number,
    default: 5
  }
}, { timestamps: true });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);