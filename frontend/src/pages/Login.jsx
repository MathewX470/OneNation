import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);
const validatePincode = (pin) => /^\d{6}$/.test(pin);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

const inputStyle = {
  width: "100%",
  border: "1px solid #D1C9B8",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
  backgroundColor: "#FDFBF7",
  color: "#0F1F3D",
  outline: "none",
  fontFamily: "sans-serif",
};

const FieldWrapper = ({ children, valid }) => (
  <div style={{ position: "relative" }}>
    {children}
    {valid && (
      <div style={{ position: "absolute", inset: "0 12px 0 auto", display: "flex", alignItems: "center", pointerEvents: "none" }}>
        <span style={{ color: "#4CAF50", fontWeight: "bold", fontSize: "16px" }}>✓</span>
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
    fullname: "", phoneNo: "", email: "", password: "",
    confirmPassword: "", pincode: "", aadhar: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    if (!validateEmail(formData.email)) return alert("Invalid email format");
    try {
      await axios.post("http://localhost:5000/api/users/send-otp", { email: formData.email });
      setOtpSent(true);
      alert("OTP sent to email");
    } catch (err) { alert(err.response?.data?.message || "Failed to send OTP"); }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/verify-otp", { email: formData.email, otp: otpInput });
      setOtpVerified(true);
    } catch (err) { alert(err.response?.data?.message || "Invalid OTP"); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phoneNo)) return alert("Invalid phone number");
    if (!validateEmail(formData.email)) return alert("Invalid email");
    if (!validatePincode(formData.pincode)) return alert("Invalid pincode");
    if (!validatePassword(formData.password)) return alert("Weak password");
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
    if (!otpVerified) return alert("Verify email first");
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", { ...formData, lat: 0, lng: 0 });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) { alert(err.response?.data?.message || "Registration failed"); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validatePhone(formData.phoneNo)) return alert("Enter valid phone");
    if (!formData.password) return alert("Enter password");
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        phoneNo: formData.phoneNo, password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) { alert(err.response?.data?.message || "Login failed"); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0A1628 0%, #0F1F3D 50%, #1a2d4f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
    }}>
      {/* Subtle gold decorative line at top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #B8972E, transparent)" }} />

      <div style={{
        width: "100%", maxWidth: "420px",
        backgroundColor: "#FDFBF7",
        borderRadius: "20px",
        padding: "40px 36px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        border: "1px solid rgba(184,151,46,0.2)",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            display: "inline-block",
            width: "48px", height: "48px",
            borderRadius: "12px",
            background: "#0F1F3D",
            marginBottom: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
          }}>
            <span style={{ fontSize: "22px" }}>🏛️</span>
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: "700", color: "#0F1F3D", fontFamily: "Georgia, serif", margin: "0 0 4px" }}>
            OneNation
          </h2>
          <p style={{ color: "#8A7E6E", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
            Unified Digital Governance Platform
          </p>
          <div style={{ width: "40px", height: "2px", background: "#B8972E", margin: "12px auto 0", borderRadius: "2px" }} />
        </div>

        {/* Tab switcher */}
        <div style={{
          display: "flex", marginBottom: "24px",
          backgroundColor: "#EDE9E0", borderRadius: "50px", padding: "4px",
        }}>
          {["Login", "Register"].map((tab) => {
            const isActive = (tab === "Login") === isLogin;
            return (
              <button key={tab}
                onClick={() => setIsLogin(tab === "Login")}
                style={{
                  flex: 1, padding: "8px", borderRadius: "50px", border: "none", cursor: "pointer",
                  fontFamily: "sans-serif", fontSize: "13px", fontWeight: isActive ? "600" : "400",
                  backgroundColor: isActive ? "#0F1F3D" : "transparent",
                  color: isActive ? "#fff" : "#6B5E4E",
                  transition: "all 0.2s",
                }}
              >{tab}</button>
            );
          })}
        </div>

        {!isLogin ? (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="text" name="fullname" placeholder="Full Name" required onChange={handleChange} style={inputStyle} />

            <FieldWrapper valid={validatePhone(formData.phoneNo)}>
              <input type="tel" name="phoneNo" placeholder="Phone Number" required onChange={handleChange} style={{ ...inputStyle, paddingRight: "36px" }} />
            </FieldWrapper>

            <div style={{ display: "flex", gap: "8px" }}>
              <FieldWrapper valid={validateEmail(formData.email)}>
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} style={{ ...inputStyle, paddingRight: "36px" }} />
              </FieldWrapper>
              <button type="button" onClick={sendOtp} style={{
                padding: "10px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                backgroundColor: "#0F1F3D", color: "#B8972E", fontSize: "12px", fontWeight: "600",
                fontFamily: "sans-serif", whiteSpace: "nowrap",
              }}>Send OTP</button>
            </div>

            {otpSent && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input type="text" placeholder="Enter OTP" maxLength={6} value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)} style={inputStyle} />
                <button type="button" onClick={verifyOtp} style={{
                  padding: "10px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                  backgroundColor: "#2D6A4F", color: "#fff", fontSize: "12px", fontWeight: "600", fontFamily: "sans-serif",
                }}>Verify</button>
                {otpVerified && <span style={{ color: "#2D6A4F", fontWeight: "bold", fontSize: "18px" }}>✔</span>}
              </div>
            )}

            <FieldWrapper valid={validatePassword(formData.password)}>
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={{ ...inputStyle, paddingRight: "36px" }} />
            </FieldWrapper>

            <FieldWrapper valid={formData.password && formData.password === formData.confirmPassword}>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} style={{ ...inputStyle, paddingRight: "36px" }} />
            </FieldWrapper>

            <FieldWrapper valid={validatePincode(formData.pincode)}>
              <input type="number" name="pincode" placeholder="Pincode" required onChange={handleChange} style={{ ...inputStyle, paddingRight: "36px" }} />
            </FieldWrapper>

            <button type="submit" style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
              backgroundColor: "#0F1F3D", color: "#fff", fontSize: "15px", fontWeight: "600",
              fontFamily: "sans-serif", marginTop: "4px", letterSpacing: "0.03em",
            }}>Register</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input type="tel" name="phoneNo" placeholder="Phone Number" required onChange={handleChange} style={inputStyle} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={inputStyle} />
            <button type="submit" style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
              backgroundColor: "#0F1F3D", color: "#fff", fontSize: "15px", fontWeight: "600",
              fontFamily: "sans-serif", marginTop: "4px", letterSpacing: "0.03em",
            }}>Login</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;