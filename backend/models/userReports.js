const mongoose = require("mongoose");
const userReportSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    location: {
        lat: Number,
        lng: Number
    },
    locationName:{
        type: String,
        default:""
    },
    upvotes: {
        type: Number,
        default: 0
    },
    photo: String,
    petition: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,       
        enum: ["Open", "In Progress", "Resolved", "Closed"],
        default: "Open"
    },
    middleManID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdminStaff",
        default:null
    },
    adminDepartment:{
        type: String,
        default:""
    },
    cancelReason: {
    type: String,
    default: null
}
}, { timestamps: true });

module.exports = mongoose.model("UserReport", userReportSchema);