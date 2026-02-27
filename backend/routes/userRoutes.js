const express = require("express");
const {
  registerUser,
  sendOtp,
  verifyOtp,
  loginUser,
  getHospitalsByLocation,
  submitDonorVerification,
  getDonorStatus,
  getPendingVerifications,
  updateDonorVerificationStatus,
  getUserProfile,
  updateUserProfile
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");  // uses User model
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// ================= AUTH =================
router.post("/register", registerUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// ================= DONOR (user) =================
router.get("/hospitals", protect, getHospitalsByLocation);             // ?state=&district=
router.get("/donor/status", protect, getDonorStatus);
router.post("/donor/verify", protect, submitDonorVerification);

// ================= DONOR (hospital) =================
router.get("/donor/pending", protect, authorize("hospital"), getPendingVerifications);
router.put("/donor/verify/:requestId", protect, authorize("hospital"), updateDonorVerificationStatus);

module.exports = router;