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
  updateUserProfile,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/userController");

const { protect }    = require("../middleware/authMiddleware");
const { authorize }  = require("../middleware/roleMiddleware");

const router = express.Router();

// ================= AUTH =================
router.post("/register",    registerUser);
router.post("/send-otp",    sendOtp);
router.post("/verify-otp",  verifyOtp);
router.post("/login",       loginUser);

// ================= PROFILE =================
router.get("/profile",  protect, getUserProfile);
router.put("/profile",  protect, updateUserProfile);

// ================= NOTIFICATIONS =================
router.get("/notifications",              protect, getMyNotifications);
router.patch("/notifications/read-all",   protect, markAllNotificationsRead);  // ⚠️ must be before /:id
router.patch("/notifications/:id/read",   protect, markNotificationRead);

// ================= DONOR (user) =================
router.get("/hospitals",      protect, getHospitalsByLocation);
router.get("/donor/status",   protect, getDonorStatus);
router.post("/donor/verify",  protect, submitDonorVerification);

// ================= DONOR (hospital) =================
router.get("/donor/pending",             protect, authorize("hospital"), getPendingVerifications);
router.put("/donor/verify/:requestId",   protect, authorize("hospital"), updateDonorVerificationStatus);

module.exports = router;