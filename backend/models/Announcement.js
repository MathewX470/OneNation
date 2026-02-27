const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      enum: ["state", "district", "location", "geo"],
      required: true,
    },

    state: String,
    district: String,
    location: String,

    geo: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      radiusKm: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
  },
  { timestamps: true }
);

/* 🔥 Enable Geo Queries */
announcementSchema.index({ geo: "2dsphere" });

module.exports = mongoose.model("Announcement", announcementSchema);