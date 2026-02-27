const express = require("express");
const {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

module.exports = router;