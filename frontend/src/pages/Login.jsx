import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ================= VALIDATION =================
const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone);

const validatePincode = (pin) =>
  /^\d{6}$/.test(pin);

const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

// ================= FIELD WRAPPER (OUTSIDE COMPONENT) =================
const FieldWrapper = ({ children, valid }) => (
  <div className="relative">
    {children}
    {valid && (
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <span className="text-green-600 text-lg font-bold">
          ✓
        </span>
      </div>
    )}
  </div>
);

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    phoneNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    pincode: "",
    aadhar: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!validateEmail(formData.email)) {
      alert("Invalid email format");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/send-otp",
        { email: formData.email }
      );

      setOtpSent(true);
      alert("OTP sent to email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/verify-otp",
        {
          email: formData.email,
          otp: otpInput,
        }
      );

      setOtpVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phoneNo))
      return alert("Invalid phone number");

    if (!validateEmail(formData.email))
      return alert("Invalid email");

    if (!validatePincode(formData.pincode))
      return alert("Invalid pincode");

    if (!validatePassword(formData.password))
      return alert("Weak password");

    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match");

    if (!otpVerified)
      return alert("Verify email first");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          ...formData,
          lat: 0,
          lng: 0,
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phoneNo))
      return alert("Enter valid phone");

    if (!formData.password)
      return alert("Enter password");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          phoneNo: formData.phoneNo,
          password: formData.password,
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">
            OneNation
          </h2>
          <p className="text-gray-500 text-sm">
            Unified Digital Governance Platform
          </p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-full transition ${
              isLogin ? "bg-white shadow font-semibold" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-full transition ${
              !isLogin ? "bg-white shadow font-semibold" : "text-gray-600"
            }`}
          >
            Register
          </button>
        </div>

        {!isLogin ? (
          <form onSubmit={handleRegister} className="space-y-4">

            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="input-style"
            />

            <FieldWrapper valid={validatePhone(formData.phoneNo)}>
              <input
                type="tel"
                name="phoneNo"
                placeholder="Phone Number"
                required
                onChange={handleChange}
                className="input-style pr-10"
              />
            </FieldWrapper>

            <div className="flex gap-2">
              <FieldWrapper valid={validateEmail(formData.email)}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                  className="input-style pr-10"
                />
              </FieldWrapper>

              <button
                type="button"
                onClick={sendOtp}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 rounded-lg transition"
              >
                OTP
              </button>
            </div>

            {otpSent && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="input-style"
                />
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="bg-green-600 text-white px-3 rounded-lg"
                >
                  Verify
                </button>
                {otpVerified && (
                  <span className="text-green-600 font-bold text-xl">
                    ✔
                  </span>
                )}
              </div>
            )}

            <FieldWrapper valid={validatePassword(formData.password)}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                onChange={handleChange}
                className="input-style pr-10"
              />
            </FieldWrapper>

            <FieldWrapper
              valid={
                formData.password &&
                formData.password === formData.confirmPassword
              }
            >
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                onChange={handleChange}
                className="input-style pr-10"
              />
            </FieldWrapper>

            <FieldWrapper valid={validatePincode(formData.pincode)}>
              <input
                type="number"
                name="pincode"
                placeholder="Pincode"
                required
                onChange={handleChange}
                className="input-style pr-10"
              />
            </FieldWrapper>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition shadow-lg"
            >
              Register
            </button>

          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="input-style"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="input-style"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition shadow-lg"
            >
              Login
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default Login;