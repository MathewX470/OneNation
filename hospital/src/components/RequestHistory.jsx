import { useEffect, useState } from "react";
import axios from "../api/axios";

const STATUS_STYLES = {
  PENDING:   { color: "#F57F17", bg: "#FFF8E1", label: "Pending" },
  FULFILLED: { color: "#2E7D32", bg: "#E8F5E9", label: "Fulfilled" },
  CANCELLED: { color: "#888888", bg: "#F5F5F5", label: "Cancelled" },
  ACTIVE:    { color: "#1565C0", bg: "#E3F2FD", label: "Active" },
};

const bloodGroupColors = {
  "A+":  "#E53935", "A-":  "#C62828",
  "B+":  "#F57F17", "B-":  "#E65100",
  "AB+": "#7B1FA2", "AB-": "#4A148C",
  "O+":  "#2E7D32", "O-":  "#1565C0",
};

const URGENCY_LABEL = {
  NORMAL: { label: "Normal", color: "#2E7D32" },
  URGENT: { label: "Urgent", color: "#F57F17" },
  CRITICAL: { label: "Critical", color: "#C62828" },
};

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("hospitalToken");
    axios.get("/hospital/requests", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setRequests(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .rh-page {
          min-height: 100vh;
          background: #F8F6F2;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .rh-header {
          max-width: 900px;
          margin: 0 auto 36px;
        }

        .rh-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .rh-title span { color: #C62828; }
        .rh-subtitle { color: #888; font-size: 0.9rem; font-weight: 300; margin: 0; }

        .rh-count {
          display: inline-block;
          margin-top: 12px;
          background: #1A1A1A;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
        }

        /* Table-style list */
        .rh-list {
          max-width: 900px;
          margin: 0 auto;
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
        }

        .rh-list-header {
          display: grid;
          grid-template-columns: 80px 1fr 100px 120px 110px;
          gap: 12px;
          padding: 14px 24px;
          background: #F8F8F8;
          border-bottom: 1.5px solid #F0F0F0;
        }

        .rh-col-head {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #BBBBBB;
        }

        .rh-row {
          display: grid;
          grid-template-columns: 80px 1fr 100px 120px 110px;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1.5px solid #F8F8F8;
          align-items: center;
          transition: background 0.15s;
          animation: fadeUp 0.4s ease both;
        }
        .rh-row:last-child { border-bottom: none; }
        .rh-row:hover { background: #FAFAFA; }

        .rh-blood-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          border: 2px solid var(--bc);
          color: var(--bc);
          background: var(--bbg);
        }

        .rh-id-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: #888;
          font-variant-numeric: tabular-nums;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .rh-units {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1A1A1A;
        }
        .rh-units-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: #AAA;
          margin-top: 1px;
        }

        .rh-urgency {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--uc);
        }
        .rh-urgency-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--uc);
          flex-shrink: 0;
        }

        .rh-status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sc);
          background: var(--sbg);
        }

        /* Skeleton */
        .rh-skeleton-row {
          display: grid;
          grid-template-columns: 80px 1fr 100px 120px 110px;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1.5px solid #F8F8F8;
          align-items: center;
          animation: pulse 1.4s infinite ease-in-out;
        }
        .rh-skeleton-cell {
          background: #F0F0F0;
          border-radius: 8px;
        }

        .rh-empty {
          padding: 60px 24px;
          text-align: center;
        }
        .rh-empty-icon { font-size: 2.5rem; display: block; margin-bottom: 10px; opacity: 0.3; }
        .rh-empty-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600; color: #CCC; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        @media (max-width: 640px) {
          .rh-list-header { display: none; }
          .rh-row {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .rh-skeleton-row { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="rh-page">
        <div className="rh-header">
          <h1 className="rh-title">Request <span>History</span></h1>
          <p className="rh-subtitle">Track all blood requests made by your hospital</p>
          {!loading && (
            <span className="rh-count">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </span>
          )}
        </div>

        <div className="rh-list">
          {!loading && requests.length > 0 && (
            <div className="rh-list-header">
              <div className="rh-col-head">Blood</div>
              <div className="rh-col-head">Request ID</div>
              <div className="rh-col-head">Units</div>
              <div className="rh-col-head">Urgency</div>
              <div className="rh-col-head">Status</div>
            </div>
          )}

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div className="rh-skeleton-row" key={i} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="rh-skeleton-cell" style={{ height: 44, borderRadius: 12 }} />
                <div className="rh-skeleton-cell" style={{ height: 14, width: "70%" }} />
                <div className="rh-skeleton-cell" style={{ height: 20, width: 40 }} />
                <div className="rh-skeleton-cell" style={{ height: 14, width: 70 }} />
                <div className="rh-skeleton-cell" style={{ height: 24, width: 80, borderRadius: 100 }} />
              </div>
            ))
          ) : requests.length === 0 ? (
            <div className="rh-empty">
              <span className="rh-empty-icon">📋</span>
              <p className="rh-empty-text">No requests yet</p>
            </div>
          ) : (
            requests.map((req, i) => {
              const statusStyle = STATUS_STYLES[req.status] || STATUS_STYLES.PENDING;
              const urgencyStyle = URGENCY_LABEL[req.urgencyLevel] || URGENCY_LABEL.NORMAL;
              const bloodColor = bloodGroupColors[req.bloodGroup] || "#888";

              return (
                <div
                  className="rh-row"
                  key={req._id}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div
                    className="rh-blood-chip"
                    style={{ "--bc": bloodColor, "--bbg": bloodColor + "15" }}
                  >
                    {req.bloodGroup}
                  </div>

                  <div className="rh-id-text" title={req._id}>
                    #{req._id?.slice(-8).toUpperCase()}
                  </div>

                  <div>
                    <div className="rh-units">{req.unitsRequired}</div>
                    <div className="rh-units-label">units</div>
                  </div>

                  <div
                    className="rh-urgency"
                    style={{ "--uc": urgencyStyle.color }}
                  >
                    <span className="rh-urgency-dot" />
                    {urgencyStyle.label}
                  </div>

                  <span
                    className="rh-status-pill"
                    style={{ "--sc": statusStyle.color, "--sbg": statusStyle.bg }}
                  >
                    {statusStyle.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}