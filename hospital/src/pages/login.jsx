import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:5000/api/hospital/login",
        { email: form.email, password: form.password }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("hospitalId", data.hospital._id);
      localStorage.setItem("hospitalToken", data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          background: #F8F6F2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
        }

        @media (max-width: 768px) {
          .login-page { grid-template-columns: 1fr; }
          .login-panel { display: none; }
        }

        /* Left decorative panel */
        .login-panel {
          background: #0D1B2A;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .login-panel::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,40,40,0.18) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }

        .login-panel::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,40,40,0.1) 0%, transparent 70%);
          bottom: 60px;
          left: -50px;
        }

        .login-panel__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }

        .login-panel__logo-icon {
          width: 38px;
          height: 38px;
          background: #C62828;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .login-panel__logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
        }

        .login-panel__body { position: relative; z-index: 1; }

        .login-panel__headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0 0 16px;
        }
        .login-panel__headline span { color: #C62828; }

        .login-panel__desc {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          line-height: 1.6;
          max-width: 300px;
          margin: 0;
        }

        .login-panel__stats {
          display: flex;
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        .login-stat__number {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
        }
        .login-stat__label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
          margin-top: 2px;
        }

        /* Right form panel */
        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 400px;
          animation: fadeUp 0.4s ease;
        }

        .login-form-header { margin-bottom: 36px; }

        .login-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .login-form-title span { color: #C62828; }

        .login-form-sub {
          color: #888;
          font-size: 0.88rem;
          font-weight: 300;
          margin: 0;
        }

        .login-field { margin-bottom: 18px; }

        .login-label {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }

        .login-input-wrap { position: relative; }

        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          pointer-events: none;
          z-index: 1;
        }

        .login-input {
          width: 100%;
          padding: 13px 44px;
          border: 1.5px solid #E0E0E0;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #1A1A1A;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #C62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }
        .login-input.error-state {
          border-color: #C62828;
          background: #FFF5F5;
        }

        .login-pw-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: #AAA;
          padding: 0;
          transition: color 0.15s;
        }
        .login-pw-toggle:hover { color: #555; }

        .login-error {
          margin-top: 6px;
          padding: 10px 14px;
          background: #FFEBEE;
          border-radius: 10px;
          border-left: 3px solid #C62828;
          font-size: 0.82rem;
          color: #C62828;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: fadeUp 0.2s ease;
        }

        .login-submit {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          background: #C62828;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.22s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 22px;
        }
        .login-submit:hover:not(:disabled) {
          background: #8B0000;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(198,40,40,0.28);
        }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .login-footer {
          text-align: center;
          font-size: 0.82rem;
          color: #AAA;
        }
        .login-footer a {
          color: #C62828;
          text-decoration: none;
          font-weight: 500;
        }
        .login-footer a:hover { text-decoration: underline; }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 22px 0;
        }
        .login-divider::before, .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #EBEBEB;
        }
        .login-divider-text {
          font-size: 0.72rem;
          color: #CCC;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-page">
        {/* Left panel */}
        <div className="login-panel">
          <div className="login-panel__logo">
            <div className="login-panel__logo-icon">🩸</div>
            <span className="login-panel__logo-text">BloodBridge</span>
          </div>

          <div className="login-panel__body">
            <h1 className="login-panel__headline">
              Save Lives,<br />
              One <span>Drop</span><br />
              at a Time.
            </h1>
            <p className="login-panel__desc">
              Manage blood requests, verify donors, and coordinate critical care — all from one dashboard.
            </p>
          </div>

          <div className="login-panel__stats">
            {[
              { number: "2.4K+", label: "Donors Verified" },
              { number: "98%", label: "Match Rate" },
              { number: "24/7", label: "Availability" },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="login-stat__number">{number}</div>
                <div className="login-stat__label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form */}
        <div className="login-form-side">
          <div className="login-form-wrap">
            <div className="login-form-header">
              <h2 className="login-form-title">Welcome <span>Back</span></h2>
              <p className="login-form-sub">Sign in to your hospital dashboard</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">✉</span>
                  <input
                    className={`login-input${error ? " error-state" : ""}`}
                    name="email"
                    type="email"
                    placeholder="hospital@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">🔒</span>
                  <input
                    className={`login-input${error ? " error-state" : ""}`}
                    name="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-pw-toggle"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? "🙈" : "👁"}
                  </button>
                </div>
                {error && (
                  <div className="login-error">
                    <span>⚠</span> {error}
                  </div>
                )}
              </div>

              <button className="login-submit" type="submit" disabled={loading}>
                {loading
                  ? <><div className="login-spinner" /> Signing in…</>
                  : "Sign In"
                }
              </button>
            </form>

            
          </div>
        </div>
      </div>
    </>
  );
}