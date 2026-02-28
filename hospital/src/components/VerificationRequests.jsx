import { useEffect, useState } from "react";
import API from "../api/axios";

const STATUS_CONFIG = {
  PENDING:   { color: "#F57F17", bg: "#FFF8E1", label: "Pending Review" },
  SCHEDULED: { color: "#1565C0", bg: "#E3F2FD", label: "Scheduled" },
  VERIFIED:  { color: "#2E7D32", bg: "#E8F5E9", label: "Verified" },
  REJECTED:  { color: "#C62828", bg: "#FFEBEE", label: "Rejected" },
};

function DonorVerifyCard({ req, index, onSchedule, onVerify }) {
  const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
  const initials = (req.donor?.fullname || "?")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="vr-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="vr-card__top">
        <div className="vr-avatar">{initials}</div>
        <div className="vr-card__info">
          <div className="vr-card__name">{req.donor?.fullname || "Unknown Donor"}</div>
          <div className="vr-card__email">{req.donor?.email || "—"}</div>
        </div>
        <span
          className="vr-status-pill"
          style={{ "--sc": status.color, "--sbg": status.bg }}
        >
          {status.label}
        </span>
      </div>

      {req.appointmentDate && (
        <div className="vr-appt">
          <span className="vr-appt-icon">📅</span>
          <span className="vr-appt-date">
            Appointment: {new Date(req.appointmentDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
        </div>
      )}

      <div className="vr-card__actions">
        <button
          className="vr-btn vr-btn--outline"
          onClick={() => onSchedule(req._id)}
        >
          <span>📅</span> Schedule
        </button>
        <button
          className="vr-btn vr-btn--success"
          onClick={() => onVerify(req._id)}
          disabled={req.status === "VERIFIED"}
        >
          <span>✓</span> Verify
        </button>
      </div>
    </div>
  );
}

export default function VerificationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [dateInput, setDateInput] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchData = () =>
    API.get("/hospital/verification-requests")
      .then(({ data }) => setRequests(data))
      .finally(() => setLoading(false));

  useEffect(() => { fetchData(); }, []);

  const schedule = (id) => {
    setModal(id);
    setDateInput("");
  };

  const confirmSchedule = async () => {
    if (!dateInput) return;
    try {
      await API.put(`/verification/${modal}/schedule`, { appointmentDate: dateInput });
      showToast("Appointment scheduled");
      setModal(null);
      fetchData();
    } catch {
      showToast("Failed to schedule", "error");
    }
  };

  const verify = async (id) => {
    try {
      await API.put(`/verification/${id}/verify`);
      showToast("Donor verified successfully");
      fetchData();
    } catch {
      showToast("Verification failed", "error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .vr-page {
          min-height: 100vh;
          background: #F8F6F2;
          padding: 48px 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .vr-header { max-width: 1000px; margin: 0 auto 36px; }

        .vr-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin: 0 0 4px;
        }
        .vr-title span { color: #C62828; }
        .vr-subtitle { color: #888; font-size: 0.9rem; font-weight: 300; margin: 0; }

        .vr-count {
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

        .vr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .vr-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          animation: fadeUp 0.45s ease both;
        }
        .vr-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.09);
        }

        .vr-card__top {
          padding: 20px 22px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1.5px solid #F5F5F5;
        }

        .vr-avatar {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #C62828 0%, #8B0000 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .vr-card__info { flex: 1; overflow: hidden; }
        .vr-card__name {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1A1A1A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .vr-card__email {
          font-size: 0.8rem;
          color: #999;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vr-status-pill {
          display: inline-block;
          padding: 4px 11px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sc);
          background: var(--sbg);
          flex-shrink: 0;
        }

        .vr-appt {
          padding: 10px 22px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FAFAFA;
          border-bottom: 1.5px solid #F5F5F5;
        }
        .vr-appt-icon { font-size: 0.8rem; }
        .vr-appt-date { font-size: 0.8rem; color: #666; }

        .vr-card__actions {
          padding: 16px 22px;
          display: flex;
          gap: 10px;
        }

        .vr-btn {
          flex: 1;
          padding: 10px 14px;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.18s;
        }

        .vr-btn--outline {
          background: transparent;
          border: 1.5px solid #E0E0E0;
          color: #555;
        }
        .vr-btn--outline:hover {
          border-color: #C62828;
          color: #C62828;
          background: #FFF5F5;
        }

        .vr-btn--success {
          background: #2E7D32;
          color: #fff;
        }
        .vr-btn--success:hover:not(:disabled) {
          background: #1B5E20;
          box-shadow: 0 6px 16px rgba(46,125,50,0.28);
          transform: translateY(-1px);
        }
        .vr-btn--success:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Skeleton */
        .vr-skeleton-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
          animation: pulse 1.4s infinite ease-in-out;
        }
        .vr-skel-top { height: 86px; background: #F8F8F8; }
        .vr-skel-body { padding: 16px 22px; display: flex; gap: 10px; }
        .vr-skel-btn { flex: 1; height: 38px; background: #F0F0F0; border-radius: 12px; }

        /* Modal */
        .vr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease;
        }

        .vr-modal {
          background: #fff;
          border-radius: 24px;
          padding: 32px;
          width: 100%;
          max-width: 380px;
          margin: 24px;
          animation: slideUp 0.25s ease;
        }

        .vr-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0 0 6px;
        }
        .vr-modal-sub { font-size: 0.85rem; color: #999; margin: 0 0 22px; }

        .vr-modal-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #AAA;
          display: block;
          margin-bottom: 8px;
        }

        .vr-modal-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 22px;
        }
        .vr-modal-input:focus {
          border-color: #C62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }

        .vr-modal-row { display: flex; gap: 10px; }

        .vr-modal-cancel {
          flex: 1;
          padding: 11px;
          background: transparent;
          border: 1.5px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: #888;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.18s;
        }
        .vr-modal-cancel:hover { border-color: #888; color: #555; }

        .vr-modal-confirm {
          flex: 2;
          padding: 11px;
          background: #C62828;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.18s;
        }
        .vr-modal-confirm:hover { background: #8B0000; }
        .vr-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        .vr-empty {
          text-align: center;
          padding: 80px 24px;
          grid-column: 1 / -1;
          color: #CCC;
        }
        .vr-empty-icon { font-size: 2.5rem; display: block; margin-bottom: 10px; opacity: 0.4; }
        .vr-empty-text { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600; }

        .vr-toast {
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
        .vr-toast.success { background: #2E7D32; color: #fff; }
        .vr-toast.error { background: #C62828; color: #fff; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes toastIn { to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div className="vr-page">
        <div className="vr-header">
          <h1 className="vr-title">Verification <span>Requests</span></h1>
          <p className="vr-subtitle">Review and verify donor eligibility for blood donation</p>
          {!loading && (
            <span className="vr-count">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </span>
          )}
        </div>

        <div className="vr-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div className="vr-skeleton-card" key={i}>
                <div className="vr-skel-top" />
                <div className="vr-skel-body">
                  <div className="vr-skel-btn" />
                  <div className="vr-skel-btn" />
                </div>
              </div>
            ))
          ) : requests.length === 0 ? (
            <div className="vr-empty">
              <span className="vr-empty-icon">✅</span>
              <p className="vr-empty-text">No pending verifications</p>
            </div>
          ) : (
            requests.map((req, i) => (
              <DonorVerifyCard
                key={req._id}
                req={req}
                index={i}
                onSchedule={schedule}
                onVerify={verify}
              />
            ))
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {modal && (
        <div className="vr-modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="vr-modal">
            <h2 className="vr-modal-title">Schedule Appointment</h2>
            <p className="vr-modal-sub">Set a date for the donor's verification visit</p>
            <label className="vr-modal-label">Appointment Date</label>
            <input
              type="date"
              className="vr-modal-input"
              value={dateInput}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <div className="vr-modal-row">
              <button className="vr-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="vr-modal-confirm" onClick={confirmSchedule} disabled={!dateInput}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`vr-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}