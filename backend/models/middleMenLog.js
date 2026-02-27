const mongoose = require("mongoose");

const middleMenLogSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true
  },
  reportTitle: {
    type: String,
    required: true
  },
  forwardedTo: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model("MiddleMenLog", middleMenLogSchema);
