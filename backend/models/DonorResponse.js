const mongoose = require("mongoose");

const donorResponseSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest",
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "DECLINED", "DONATED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("DonorResponse", donorResponseSchema);