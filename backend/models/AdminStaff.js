const mongoose = require("mongoose");

const adminStaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["middleman", "department_admin"],
      required: true
    },
    department: {
      type: String,
      enum: ["electricity", "road", "environment", "water"],
      required: function () {
        return this.role === "department_admin";
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminStaff", adminStaffSchema);