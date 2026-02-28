import { useEffect, useState } from "react";
import API from "../api/axios";

const STATUS_CONFIG = {
  PENDING:   { color: "#F57F17", bg: "#FFF8E1", label: "Pending Review" },
  SCHEDULED: { color: "#1565C0", bg: "#E3F2FD", label: "Scheduled"      },
  VERIFIED:  { color: "#2E7D32", bg: "#E8F5E9", label: "Verified"        },
  REJECTED:  { color: "#C62828", bg: "#FFEBEE", label: "Rejected"        },
};

/* ── Table row card — wide desktop layout ── */
function DonorRow({ req, index, onSchedule, onVerify }) {
  const status   = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING;
  const initials = (req.donor?.fullname || "?")
    .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div
      className="vr-row"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {/* Avatar + name */}
      <div className="vr-row__donor">
        <div className="vr-avatar">{initials}</div>
        <div className="vr-row__donor-info">
          <div className="vr-row__name">{req.donor?.fullname || "Unknown Donor"}</div>
          <div className="vr-row__email">{req.donor?.email || "—"}</div>
        </div>
      </div>

      {/* Phone */}
      <div className="vr-row__cell">
        <span className="vr-row__meta">{req.donor?.phoneNo || "—"}</span>
      </div>

      {/* Appointment */}
      <div className="vr-row__cell">
        {req.appointmentDate ? (
          <span className="vr-row__appt">
            📅 {new Date(req.appointmentDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
        ) : (
          <span className="vr-row__meta vr-row__meta--muted">Not scheduled</span>
        )}
      </div>

      {/* Status pill */}
      <div className="vr-row__cell">
        <span
          className="vr-status-pill"
          style={{ "--sc": status.color, "--sbg": status.bg }}
        >
          {status.label}
        </span>
      </div>

      {/* Actions */}
      <div className="vr-row__actions">
        <button
          className="vr-btn vr-btn--outline"
          onClick={() => onSchedule(req._id)}
        >
          📅 Schedule
        </button>
        <button
          className="vr-btn vr-btn--success"
          onClick={() => onVerify(req._id)}
          disabled={req.status === "VERIFIED"}
        >
          ✓ Verify
        </button>
      </div>
    </div>
  );
}

export default function VerificationRequests() {
  const [requests,  setRequests]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null);
  const [dateInput, setDateInput] = useState("");
  const [toast,     setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const fetchData = () =>
    API.get("/hospital/verification-requests")
       .then(({ data }) => setRequests(data))
       .finally(() => setLoading(false));

  useEffect(() => { fetchData(); }, []);

  const schedule = (id) => { setModal(id); setDateInput(""); };

  const confirmSchedule = async () => {
    if (!dateInput) return;
    try {
      await API.put(`/verification/${modal}/schedule`, { appointmentDate: dateInput });
      showToast("Appointment scheduled");
      setModal(null);
      fetchData();
    } catch { showToast("Failed to schedule", "error"); }
  };

  const verify = async (id) => {
    try {
      await API.put(`/verification/${id}/verify`);
      showToast("Donor verified successfully");
      fetchData();
    } catch { showToast("Verification failed", "error"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* vr-page: child of dashboard scroll area — no min-height, no bg */
        .vr-page {
          padding: 40px 44px 56px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ── */
        .vr-header { margin-bottom: 32px; }

        .vr-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
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

        /* ── Table shell ── */
        .vr-table {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EBEBEB;
          overflow: hidden;
        }

        /* Column widths: donor(flex) | phone(160px) | appointment(200px) | status(160px) | actions(220px) */
        .vr-table-head {
          display: grid;
          grid-template-columns: 1fr 160px 200px 160px 220px;
          gap: 16px;
          padding: 14px 28px;
          background: #F8F8F8;
          border-bottom: 1.5px solid #EBEBEB;
        }

        .vr-col-head {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #BBBBBB;
        }

        /* ── Row ── */
        .vr-row {
          display: grid;
          grid-template-columns: 1fr 160px 200px 160px 220px;
          gap: 16px;
          padding: 18px 28px;
          border-bottom: 1.5px solid #F5F5F5;
          align-items: center;
          transition: background 0.15s;
          animation: fadeUp 0.4s ease both;
        }
        .vr-row:last-child { border-bottom: none; }
        .vr-row:hover { background: #FAFAFA; }

        /* Donor cell */
        .vr-row__donor {
          display: flex;
          align-items: center;
          gap: 14px;
          overflow: hidden;
        }

        .vr-avatar {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #C62828 0%, #8B0000 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }

        .vr-row__donor-info { overflow: hidden; }

        .vr-row__name {
          font-family: 'Syne', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          color: #1A1A1A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vr-row__email {
          font-size: 0.78rem;
          color: #999;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Generic data cells */
        .vr-row__cell { display: flex; align-items: center; }

        .vr-row__meta {
          font-size: 0.85rem;
          color: #555;
        }
        .vr-row__meta--muted { color: #CCC; font-style: italic; }

        .vr-row__appt {
          font-size: 0.82rem;
          color: #555;
          white-space: nowrap;
        }

        /* Status pill */
        .vr-status-pill {
          display: inline-block;
          padding: 5px 13px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sc);
          background: var(--sbg);
          white-space: nowrap;
        }

        /* Action buttons */
        .vr-row__actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .vr-btn {
          padding: 8px 14px;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.18s;
          white-space: nowrap;
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
          box-shadow: 0 4px 14px rgba(46,125,50,0.28);
          transform: translateY(-1px);
        }
        .vr-btn--success:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* ── Skeleton rows ── */
        .vr-skeleton-row {
          display: grid;
          grid-template-columns: 1fr 160px 200px 160px 220px;
          gap: 16px;
          padding: 18px 28px;
          border-bottom: 1.5px solid #F5F5F5;
          align-items: center;
          animation: pulse 1.4s infinite ease-in-out;
        }

        .vr-skel-cell {
          background: #F0F0F0;
          border-radius: 8px;
        }

        .vr-skel-donor {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* ── Empty state ── */
        .vr-empty {
          text-align: center;
          padding: 80px 24px;
          color: #CCC;
        }
        .vr-empty-icon  { font-size: 2.5rem; display: block; margin-bottom: 10px; opacity: 0.4; }
        .vr-empty-text  { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600; }

        /* ── Modal ── */
        .vr-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.36);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          backdrop-filter: blur(3px);
          animation: fadeIn 0.2s ease;
        }

        .vr-modal {
          background: #fff;
          border-radius: 24px;
          padding: 40px 44px;
          width: 460px;
          animation: slideUp 0.25s ease;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        }

        .vr-modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0 0 6px;
        }
        .vr-modal-sub {
          font-size: 0.88rem;
          color: #999;
          margin: 0 0 28px;
        }

        .vr-modal-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #AAA;
          display: block;
          margin-bottom: 8px;
        }

        .vr-modal-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1A1A1A;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          margin-bottom: 28px;
        }
        .vr-modal-input:focus {
          border-color: #C62828;
          box-shadow: 0 0 0 3px rgba(198,40,40,0.08);
        }

        .vr-modal-row { display: flex; gap: 12px; }

        .vr-modal-cancel {
          flex: 1;
          padding: 13px;
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
          padding: 13px;
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
        .vr-modal-confirm:hover    { background: #8B0000; }
        .vr-modal-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Toast ── */
        .vr-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          padding: 13px 28px;
          border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 30px rgba(0,0,0,0.16);
          opacity: 0;
          animation: toastIn 0.3s ease forwards;
          z-index: 999;
          white-space: nowrap;
        }
        .vr-toast.success { background: #2E7D32; color: #fff; }
        .vr-toast.error   { background: #C62828; color: #fff; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes toastIn { to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>

      <div className="vr-page">

        {/* Header */}
        <div className="vr-header">
          <h1 className="vr-title">Verification <span>Requests</span></h1>
          <p className="vr-subtitle">Review and verify donor eligibility for blood donation</p>
          {!loading && (
            <span className="vr-count">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="vr-table">

          {/* Column headers */}
          {!loading && requests.length > 0 && (
            <div className="vr-table-head">
              <div className="vr-col-head">Donor</div>
              <div className="vr-col-head">Phone</div>
              <div className="vr-col-head">Appointment</div>
              <div className="vr-col-head">Status</div>
              <div className="vr-col-head">Actions</div>
            </div>
          )}

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div className="vr-skeleton-row" key={i} style={{ animationDelay: `${i * 80}ms` }}>
                <div className="vr-skel-donor">
                  <div className="vr-skel-cell" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="vr-skel-cell" style={{ height: 14, width: "60%", marginBottom: 6 }} />
                    <div className="vr-skel-cell" style={{ height: 12, width: "80%" }} />
                  </div>
                </div>
                <div className="vr-skel-cell" style={{ height: 14, width: 100 }} />
                <div className="vr-skel-cell" style={{ height: 14, width: 130 }} />
                <div className="vr-skel-cell" style={{ height: 26, width: 110, borderRadius: 100 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <div className="vr-skel-cell" style={{ height: 34, width: 90, borderRadius: 10 }} />
                  <div className="vr-skel-cell" style={{ height: 34, width: 80, borderRadius: 10 }} />
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
              <DonorRow
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

      {/* Schedule modal */}
      {modal && (
        <div
          className="vr-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
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
              <button className="vr-modal-cancel"  onClick={() => setModal(null)}>Cancel</button>
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