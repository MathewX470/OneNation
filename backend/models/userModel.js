

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
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
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    isVerifiedDonor: {
        type: Boolean,
        default: false
    },
    pincode: {
        type: Number,
        required: true
    },
    aadhar: {
    type: String,
    unique: true,
    sparse: true,
    default: null
}


});


const User = mongoose.model("User", userSchema);
module.exports = User;