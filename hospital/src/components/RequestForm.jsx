import { useState } from "react";
import axios from "../api/axios";

const BLOOD_GROUPS = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];
const URGENCY = [
  { value: "NORMAL",   label: "Normal",   color: "#2E7D32", bg: "#E8F5E9", desc: "Non-emergency, within days" },
  { value: "URGENT",   label: "Urgent",   color: "#F57F17", bg: "#FFF8E1", desc: "Needed within 24 hours" },
  { value: "CRITICAL", label: "Critical", color: "#C62828", bg: "#FFEBEE", desc: "Immediate — life-threatening" },
];

const bloodGroupColors = {
  "A+":  "#E53935", "A-":  "#C62828",
  "B+":  "#F57F17", "B-":  "#E65100",
  "AB+": "#7B1FA2", "AB-": "#4A148C",
  "O+":  "#2E7D32", "O-":  "#1565C0",
};

export default function RequestForm() {
  const [form, setForm] = useState({ bloodGroup: "A+", unitsRequired: "", urgencyLevel: "NORMAL" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.unitsRequired) return showToast("Please enter units required", "error");
    const token = localStorage.getItem("hospitalToken");
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/hospital/request", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Blood request created successfully");
      setForm(p => ({ ...p, unitsRequired: "" }));
    } catch {
      showToast("Failed to create request", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .rf-page {
          min-height: 100vh;
          background: #F8F6F2;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .rf-wrap { width: 100%; max-width: 520px; animation: fadeUp 0.4s ease; }

        .rf-header { margin-bottom: 28px; }
        .rf-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .rf-title span { color: #C62828; }
        .rf-subtitle { color: #888; font-size: 0.9rem; font-weight: 300; margin: 0; }

        .rf-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
        }

        .rf-section {
          padding: 26px 28px;
          border-bottom: 1.5px solid #F0F0F0;
        }
        .rf-section:last-child { border-bottom: none; }

        .rf-section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #AAAAAA;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rf-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #F0F0F0;
        }

        /* Blood group picker */
        .rf-blood-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .rf-blood-btn {
          padding: 14px 8px;
          border-radius: 14px;
          border: 2px solid #EBEBEB;
          background: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #AAA;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rf-blood-btn:hover {
          border-color: var(--c);
          color: var(--c);
          background: var(--bg);
        }
        .rf-blood-btn.active {
          border-color: var(--c);
          color: var(--c);
          background: var(--bg);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--c) 15%, transparent);
        }

        /* Units input */
        .rf-units-wrap { position: relative; }
        .rf-units-input {
          width: 100%;
          padding: 13px 60px 13px 16px;
          border: 1.5px solid #E0E0E0;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rf-units-input:focus {
          border-color: #C62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }
        .rf-units-suffix {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #BBB;
        }

        /* Urgency */
        .rf-urgency-group { display: flex; flex-direction: column; gap: 10px; }

        .rf-urgency-btn {
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid #EBEBEB;
          background: #fff;
          cursor: pointer;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          gap: 14px;
          text-align: left;
        }
        .rf-urgency-btn:hover {
          border-color: var(--uc);
          background: var(--ubg);
        }
        .rf-urgency-btn.active {
          border-color: var(--uc);
          background: var(--ubg);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--uc) 12%, transparent);
        }

        .rf-urgency-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--uc);
          flex-shrink: 0;
        }

        .rf-urgency-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #1A1A1A;
        }
        .rf-urgency-desc {
          font-size: 0.78rem;
          color: #888;
          margin-top: 2px;
        }

        .rf-submit {
          width: 100%;
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
        }
        .rf-submit:hover:not(:disabled) {
          background: #8B0000;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(198,40,40,0.28);
        }
        .rf-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rf-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .rf-toast {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          padding: 12px 24px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          opacity: 0;
          animation: toastIn 0.3s ease forwards;
          z-index: 999;
          white-space: nowrap;
        }
        .rf-toast.success { background: #2E7D32; color: #fff; }
        .rf-toast.error { background: #C62828; color: #fff; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn {
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="rf-page">
        <div className="rf-wrap">
          <div className="rf-header">
            <h1 className="rf-title">Blood <span>Request</span></h1>
            <p className="rf-subtitle">Create a new blood requirement for your hospital</p>
          </div>

          <form className="rf-card" onSubmit={handleSubmit}>
            {/* Blood Group */}
            <div className="rf-section">
              <p className="rf-section-label">Blood Group</p>
              <div className="rf-blood-grid">
                {BLOOD_GROUPS.map((bg) => (
                  <button
                    type="button"
                    key={bg}
                    className={`rf-blood-btn${form.bloodGroup === bg ? " active" : ""}`}
                    style={{ "--c": bloodGroupColors[bg], "--bg": bloodGroupColors[bg] + "18" }}
                    onClick={() => setForm(p => ({ ...p, bloodGroup: bg }))}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Units */}
            <div className="rf-section">
              <p className="rf-section-label">Units Required</p>
              <div className="rf-units-wrap">
                <input
                  className="rf-units-input"
                  type="number"
                  name="unitsRequired"
                  min="1"
                  placeholder="0"
                  value={form.unitsRequired}
                  onChange={(e) => setForm(p => ({ ...p, unitsRequired: e.target.value }))}
                />
                <span className="rf-units-suffix">Units</span>
              </div>
            </div>

            {/* Urgency */}
            <div className="rf-section">
              <p className="rf-section-label">Urgency Level</p>
              <div className="rf-urgency-group">
                {URGENCY.map(({ value, label, color, bg, desc }) => (
                  <button
                    type="button"
                    key={value}
                    className={`rf-urgency-btn${form.urgencyLevel === value ? " active" : ""}`}
                    style={{ "--uc": color, "--ubg": bg }}
                    onClick={() => setForm(p => ({ ...p, urgencyLevel: value }))}
                  >
                    <div className="rf-urgency-dot" />
                    <div>
                      <div className="rf-urgency-name">{label}</div>
                      <div className="rf-urgency-desc">{desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="rf-section">
              <button className="rf-submit" type="submit" disabled={loading}>
                {loading ? <><div className="rf-spinner" /> Submitting…</> : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <div className={`rf-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}