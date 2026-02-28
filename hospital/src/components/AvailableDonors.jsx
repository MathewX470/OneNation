import { useEffect, useState } from "react";
import API from "../api/axios";

const bloodGroupColors = {
  "A+":  { bg: "#FFF1F1", accent: "#E53935", light: "#FFCDD2" },
  "A-":  { bg: "#FFF1F1", accent: "#C62828", light: "#FFCDD2" },
  "B+":  { bg: "#FFF8E1", accent: "#F57F17", light: "#FFECB3" },
  "B-":  { bg: "#FFF8E1", accent: "#E65100", light: "#FFECB3" },
  "AB+": { bg: "#F3E5F5", accent: "#7B1FA2", light: "#E1BEE7" },
  "AB-": { bg: "#F3E5F5", accent: "#4A148C", light: "#E1BEE7" },
  "O+":  { bg: "#E8F5E9", accent: "#2E7D32", light: "#C8E6C9" },
  "O-":  { bg: "#E3F2FD", accent: "#1565C0", light: "#BBDEFB" },
};
const defaultColor = { bg: "#F5F5F5", accent: "#424242", light: "#E0E0E0" };

function DonorCard({ donor: d, index }) {
  const colors = bloodGroupColors[d.bloodGroup] || defaultColor;

  return (
    <div
      className="donor-card"
      style={{
        animationDelay: `${index * 55}ms`,
        "--accent": colors.accent,
        "--bg":     colors.bg,
        "--light":  colors.light,
      }}
    >
      <div className="blood-badge">
        <span className="blood-label">{d.bloodGroup}</span>
        <div className="blood-drop">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6 8.5 4 13 4 16a8 8 0 0016 0c0-3-2-7.5-8-14z" />
          </svg>
        </div>
      </div>

      <div className="donor-body">
        <div className="donor-name">{d.donor?.fullname || "Anonymous Donor"}</div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-icon">✉</span>
            <span className="info-text">{d.donor?.email || "—"}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">☏</span>
            <span className="info-text">{d.donor?.phoneNo || "—"}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">⌖</span>
            <span className="info-text">{d.district}, {d.state}</span>
          </div>
          <div className="info-item">
            <span className="info-icon">#</span>
            <span className="info-text">{d.donor?.pincode || "—"}</span>
          </div>
        </div>
      </div>

      <div className="card-glow" />
    </div>
  );
}

export default function AvailableDonors() {
  const [donors,  setDonors]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/donors/available")
      .then(({ data }) => setDonors(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        /* No min-height / no bg — lives inside dashboard scroll area */
        .donors-root {
          font-family: 'DM Sans', sans-serif;
          padding: 40px 44px 56px;
        }

        .donors-header { margin-bottom: 32px; }

        .donors-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0 0 6px;
        }
        .donors-title span { color: #E53935; }

        .donors-subtitle { color: #888; font-size: 0.9rem; font-weight: 300; margin: 0 0 14px; }

        .donors-count {
          display: inline-block;
          background: #1A1A1A;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
        }

        /* Fixed 4-column desktop grid */
        .donors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .donor-card {
          position: relative;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1.5px solid #EBEBEB;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          animation: fadeUp 0.5s both ease;
          cursor: default;
        }
        .donor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 38px rgba(0,0,0,0.09);
          border-color: var(--accent);
        }
        .donor-card:hover .card-glow { opacity: 1; }

        .card-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          pointer-events: none;
          background: radial-gradient(circle at 0% 0%, var(--light) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .blood-badge {
          background: var(--bg);
          padding: 20px 24px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1.5px solid var(--light);
        }

        .blood-label {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .blood-drop { width: 36px; height: 36px; color: var(--accent); opacity: 0.35; }

        .donor-body {
          padding: 20px 24px 24px;
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .donor-name {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1A1A1A;
          margin-bottom: 14px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .info-grid { display: flex; flex-direction: column; gap: 9px; }

        .info-item { display: flex; align-items: center; gap: 10px; }

        .info-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          background: #F5F5F5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: #666;
          flex-shrink: 0;
          line-height: 28px;
          text-align: center;
        }

        .info-text {
          font-size: 0.855rem;
          color: #555;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Skeleton */
        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
          animation: pulse 1.5s infinite ease-in-out;
        }
        .skeleton-top  { height: 80px; background: #F5F5F5; }
        .skeleton-body { padding: 20px 24px; }
        .skeleton-line { background: #EBEBEB; border-radius: 6px; margin-bottom: 10px; }

        .empty-state {
          text-align: center;
          padding: 80px 24px;
          grid-column: 1/-1;
          color: #AAA;
        }
        .empty-icon { font-size: 3rem; margin-bottom: 12px; display: block; opacity: 0.4; }
        .empty-text { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 600; color: #CCC; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>

      <div className="donors-root">
        <div className="donors-header">
          <h1 className="donors-title">Available <span>Donors</span></h1>
          <p className="donors-subtitle">Ready to save a life — find a match near you</p>
          {!loading && (
            <span className="donors-count">
              {donors.length} {donors.length === 1 ? "Donor" : "Donors"} Available
            </span>
          )}
        </div>

        <div className="donors-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-top" />
                <div className="skeleton-body">
                  <div className="skeleton-line" style={{ height: 18, width: "60%" }} />
                  <div className="skeleton-line" style={{ height: 14, width: "80%" }} />
                  <div className="skeleton-line" style={{ height: 14, width: "70%" }} />
                  <div className="skeleton-line" style={{ height: 14, width: "55%" }} />
                </div>
              </div>
            ))
          ) : donors.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🩸</span>
              <p className="empty-text">No donors available right now</p>
            </div>
          ) : (
            donors.map((d, i) => <DonorCard key={d._id} donor={d} index={i} />)
          )}
        </div>
      </div>
    </>
  );
}