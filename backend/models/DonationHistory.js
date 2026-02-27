const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true
  },
  request: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest"
  },
  donationDate: {
    type: Date,
    default: Date.now
  },
  unitsDonated: Number
}, { timestamps: true });

module.exports = mongoose.model("DonationHistory", donationHistorySchema);