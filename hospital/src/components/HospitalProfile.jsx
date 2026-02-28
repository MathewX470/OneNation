import { useEffect, useState } from "react";
import API from "../api/axios";

export default function HospitalProfile() {
  const [form, setForm] = useState({
    name: "", phone: "", state: "", district: "",
    lat: "", lng: "", password: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  useEffect(() => {
    API.get("/hospital/profile")
      .then(({ data }) => setForm({
        name:     data.name     || "",
        phone:    data.phone    || "",
        state:    data.state    || "",
        district: data.district || "",
        lat: data.location?.coordinates?.[1] || "",
        lng: data.location?.coordinates?.[0] || "",
        password: ""
      }))
      .catch(() => showToast("Failed to load profile", "error"));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return showToast("Geolocation not supported", "error");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setForm(p => ({ ...p, lat: coords.latitude, lng: coords.longitude })),
      () => showToast("Unable to retrieve location", "error")
    );
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      await API.put("/hospital/profile", { ...form, lat: Number(form.lat), lng: Number(form.lng) });
      showToast("Profile updated successfully");
      setForm(p => ({ ...p, password: "" }));
    } catch {
      showToast("Profile update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name",     label: "Hospital Name", icon: "🏥", type: "text" },
    { name: "phone",    label: "Phone Number",  icon: "☏",  type: "tel"  },
    { name: "state",    label: "State",         icon: "🗺",  type: "text" },
    { name: "district", label: "District",      icon: "📍", type: "text" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* No min-height / no bg — lives inside dashboard scroll area */
        .hp-page {
          padding: 40px 44px 56px;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .hp-wrap {
          width: 100%;
          max-width: 680px;
          animation: fadeUp 0.4s ease;
        }

        .hp-header { margin-bottom: 28px; }

        .hp-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .hp-title span { color: #C62828; }
        .hp-subtitle { color: #888; font-size: 0.9rem; font-weight: 300; margin: 0; }

        .hp-card {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
        }

        .hp-section {
          padding: 28px 36px;
          border-bottom: 1.5px solid #F0F0F0;
        }
        .hp-section:last-child { border-bottom: none; }

        .hp-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #AAAAAA;
          margin: 0 0 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hp-section-title::after {
          content: ''; flex: 1; height: 1px; background: #F0F0F0;
        }

        /* 2-column field grid */
        .hp-field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .hp-field-grid .hp-field-full { grid-column: 1 / -1; }

        .hp-field { display: flex; flex-direction: column; gap: 6px; }

        .hp-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #999;
        }

        .hp-input-wrap { position: relative; }

        .hp-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          pointer-events: none;
        }

        .hp-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          border: 1.5px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: #1A1A1A;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .hp-input:focus {
          border-color: #C62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }
        .hp-input.no-icon { padding-left: 16px; }

        /* Location */
        .hp-coord-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .hp-coord-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #BBB;
          margin-bottom: 6px;
        }

        .hp-coord-val {
          padding: 12px 16px;
          background: #F8F8F8;
          border: 1.5px solid #EBEBEB;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          color: #888;
          font-variant-numeric: tabular-nums;
        }

        .hp-loc-btn {
          margin-top: 16px;
          width: 100%;
          padding: 12px 18px;
          background: transparent;
          border: 1.5px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .hp-loc-btn:hover {
          border-color: #C62828;
          color: #C62828;
          background: #FFF5F5;
        }

        .hp-submit-btn {
          width: 100%;
          padding: 15px;
          background: #C62828;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
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
        .hp-submit-btn:hover:not(:disabled) {
          background: #8B0000;
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(198,40,40,0.3);
        }
        .hp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .hp-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .hp-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          padding: 12px 28px;
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
        .hp-toast.success { background: #2E7D32; color: #fff; }
        .hp-toast.error   { background: #C62828; color: #fff; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes toastIn { to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div className="hp-page">
        <div className="hp-wrap">
          <div className="hp-header">
            <h1 className="hp-title">Hospital <span>Profile</span></h1>
            <p className="hp-subtitle">Manage your hospital information and location</p>
          </div>

          <div className="hp-card">

            {/* Basic Info */}
            <div className="hp-section">
              <p className="hp-section-title">Basic Information</p>
              <div className="hp-field-grid">
                {fields.map(({ name, label, icon, type }) => (
                  <div className={`hp-field${name === "name" ? " hp-field-full" : ""}`} key={name}>
                    <label className="hp-label">{label}</label>
                    <div className="hp-input-wrap">
                      <span className="hp-input-icon">{icon}</span>
                      <input
                        className="hp-input"
                        name={name} type={type}
                        value={form[name]}
                        onChange={handleChange}
                        placeholder={label}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="hp-section">
              <p className="hp-section-title">Location Coordinates</p>
              <div className="hp-coord-row">
                {["lat", "lng"].map((k) => (
                  <div key={k}>
                    <div className="hp-coord-label">{k === "lat" ? "Latitude" : "Longitude"}</div>
                    <div className="hp-coord-val">{form[k] || "—"}</div>
                  </div>
                ))}
              </div>
              <button className="hp-loc-btn" onClick={getCurrentLocation}>
                <span>📍</span> Use Current Location
              </button>
            </div>

            {/* Security */}
            <div className="hp-section">
              <p className="hp-section-title">Security</p>
              <div className="hp-field">
                <label className="hp-label">New Password (optional)</label>
                <div className="hp-input-wrap">
                  <span className="hp-input-icon">🔒</span>
                  <input
                    className="hp-input"
                    name="password" type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="hp-section">
              <button className="hp-submit-btn" onClick={updateProfile} disabled={loading}>
                {loading ? <><div className="hp-spinner" /> Saving…</> : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>

      {toast && <div className={`hp-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}