import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import AvailableDonors    from "../components/AvailableDonors";
import HospitalProfile    from "../components/HospitalProfile";
import RequestForm        from "../components/RequestForm";
import RequestHistory     from "../components/RequestHistory";
import VerificationRequests from "../components/VerificationRequests";

const SIDEBAR_WIDTH = 260;

const NAV_ITEMS = [
  { key: "overview",     label: "Dashboard",           icon: "⊞" },
  { key: "profile",      label: "Hospital Profile",    icon: "🏥" },
  { key: "raise",        label: "Raise Request",       icon: "＋" },
  { key: "history",      label: "Request History",     icon: "📋" },
  { key: "divider" },
  { key: "verification", label: "Donor Verifications", icon: "✓"  },
  { key: "donors",       label: "Available Donors",    icon: "🩸" },
];

function OverviewContent() {
  return (
    <div className="db-overview">
      <div className="db-overview__welcome">
        <h2 className="db-overview__title">Welcome <span>Back</span></h2>
        <p className="db-overview__sub">Here's a snapshot of your hospital's activity</p>
      </div>
      <div className="db-overview__cards">
        {[
          { icon: "🩸", label: "Available Donors",       value: "—", color: "#C62828", bg: "#FFF1F1" },
          { icon: "📋", label: "Active Requests",        value: "—", color: "#1565C0", bg: "#E3F2FD" },
          { icon: "✓",  label: "Verified Donors",        value: "—", color: "#2E7D32", bg: "#E8F5E9" },
          { icon: "⏳", label: "Pending Verifications",  value: "—", color: "#F57F17", bg: "#FFF8E1" },
        ].map(({ icon, label, value, color, bg }) => (
          <div className="db-stat-card" key={label} style={{ "--ac": color, "--abg": bg }}>
            <div className="db-stat-card__icon">{icon}</div>
            <div className="db-stat-card__value">{value}</div>
            <div className="db-stat-card__label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("hospitalToken");
    navigate("/");
  };

  const content = useMemo(() => {
    switch (active) {
      case "raise":        return <RequestForm />;
      case "profile":      return <HospitalProfile />;
      case "history":      return <RequestHistory />;
      case "verification": return <VerificationRequests />;
      case "donors":       return <AvailableDonors />;
      default:             return <OverviewContent />;
    }
  }, [active]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body, #root {
          height: 100%;
          font-family: 'DM Sans', sans-serif;
          background: #F8F6F2;
          /* Hard floor — never collapse below a usable desktop width */
          min-width: 1280px;
          overflow-x: auto;
        }

        /* ── Shell ── */
        .db-shell {
          display: flex;
          height: 100vh;
          min-width: 1280px;
          overflow: hidden;
          background: #F8F6F2;
        }

        /* ── Sidebar ── */
        .db-sidebar {
          width: ${SIDEBAR_WIDTH}px;
          min-width: ${SIDEBAR_WIDTH}px;
          flex-shrink: 0;
          background: #0D1B2A;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: relative;
          overflow: hidden;
          z-index: 10;
        }

        .db-sidebar::before {
          content: '';
          position: absolute;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,40,40,0.14) 0%, transparent 70%);
          top: -90px; right: -90px;
          pointer-events: none;
        }

        .db-sidebar__logo {
          padding: 28px 24px 22px;
          display: flex;
          align-items: center;
          gap: 11px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .db-sidebar__logo-icon {
          width: 36px; height: 36px;
          background: #C62828;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .db-sidebar__logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .db-sidebar__nav {
          flex: 1;
          padding: 20px 14px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
        }

        .db-sidebar__section-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          padding: 0 10px 10px;
        }

        .db-sidebar__divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 10px 10px 16px;
        }

        .db-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          margin-bottom: 3px;
          cursor: pointer;
          transition: background 0.18s;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .db-nav-item:hover  { background: rgba(255,255,255,0.06); }
        .db-nav-item.active { background: rgba(198,40,40,0.18); }

        .db-nav-item__icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          flex-shrink: 0;
          background: rgba(255,255,255,0.05);
          transition: background 0.18s;
        }
        .db-nav-item.active .db-nav-item__icon { background: #C62828; }

        .db-nav-item__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          color: rgba(255,255,255,0.45);
          transition: color 0.18s;
          white-space: nowrap;
        }
        .db-nav-item:hover .db-nav-item__label   { color: rgba(255,255,255,0.78); }
        .db-nav-item.active .db-nav-item__label  { color: #fff; font-weight: 600; }

        .db-sidebar__footer {
          padding: 16px 14px 22px;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        .db-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 11px;
          width: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.18s;
        }
        .db-logout-btn:hover { background: rgba(198,40,40,0.15); }

        .db-logout-btn__icon {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
        }

        .db-logout-btn__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
        }

        /* ── Main ── */
        .db-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        /* ── Topbar ── */
        .db-topbar {
          flex-shrink: 0;
          height: 62px;
          background: #fff;
          border-bottom: 1.5px solid #EBEBEB;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px;
          z-index: 5;
        }

        .db-topbar__breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .db-topbar__crumb-root {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: #BBBBBB;
        }

        .db-topbar__crumb-sep { font-size: 0.75rem; color: #DDDDDD; }

        .db-topbar__crumb-current {
          font-family: 'Syne', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          color: #1A1A1A;
          letter-spacing: 0.01em;
        }

        .db-topbar__right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .db-topbar__hospital-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          background: #F5F5F5;
          border-radius: 100px;
          padding: 6px 16px 6px 8px;
        }

        .db-topbar__hospital-dot {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C62828, #8B0000);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #fff;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }

        .db-topbar__hospital-name {
          font-size: 0.82rem;
          font-weight: 500;
          color: #444;
          white-space: nowrap;
        }

        /* ── Scroll area ── */
        .db-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        /* Strip full-page chrome from child components */
        .db-scroll .donors-root,
        .db-scroll .hp-page,
        .db-scroll .rf-page,
        .db-scroll .rh-page,
        .db-scroll .vr-page {
          min-height: unset !important;
          background: transparent !important;
        }

        /* ── Overview ── */
        .db-overview { padding: 44px 44px 56px; }
        .db-overview__welcome { margin-bottom: 40px; }

        .db-overview__title {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: #1A1A1A;
          letter-spacing: -0.03em;
          margin-bottom: 6px;
        }
        .db-overview__title span { color: #C62828; }

        .db-overview__sub {
          font-size: 0.92rem;
          color: #888;
          font-weight: 300;
        }

        /* 4-column fixed grid on desktop */
        .db-overview__cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }

        .db-stat-card {
          background: #fff;
          border-radius: 18px;
          border: 1.5px solid #EBEBEB;
          padding: 26px 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
        }
        .db-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.08);
        }

        .db-stat-card__icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: var(--abg);
          color: var(--ac);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          margin-bottom: 18px;
        }

        .db-stat-card__value {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: #1A1A1A;
          line-height: 1;
          margin-bottom: 5px;
        }

        .db-stat-card__label {
          font-size: 0.78rem;
          color: #AAAAAA;
          font-weight: 400;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="db-shell">

        {/* ── Sidebar ── */}
        <aside className="db-sidebar">
          <div className="db-sidebar__logo">
            <div className="db-sidebar__logo-icon">🩸</div>
            <span className="db-sidebar__logo-text">BloodBridge</span>
          </div>

          <nav className="db-sidebar__nav">
            <div className="db-sidebar__section-label">Navigation</div>
            {NAV_ITEMS.map((item, i) => {
              if (item.key === "divider") return <div className="db-sidebar__divider" key={i} />;
              return (
                <button
                  key={item.key}
                  className={`db-nav-item${active === item.key ? " active" : ""}`}
                  onClick={() => setActive(item.key)}
                >
                  <span className="db-nav-item__icon">{item.icon}</span>
                  <span className="db-nav-item__label">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="db-sidebar__footer">
            <button className="db-logout-btn" onClick={logout}>
              <span className="db-logout-btn__icon">↩</span>
              <span className="db-logout-btn__label">Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="db-main">
          <header className="db-topbar">
            <div className="db-topbar__breadcrumb">
              <span className="db-topbar__crumb-root">BloodBridge</span>
              <span className="db-topbar__crumb-sep">›</span>
              <span className="db-topbar__crumb-current">
                {NAV_ITEMS.find(n => n.key === active)?.label || "Dashboard"}
              </span>
            </div>
            <div className="db-topbar__right">
              <div className="db-topbar__hospital-pill">
                <div className="db-topbar__hospital-dot">H</div>
                <span className="db-topbar__hospital-name">Hospital</span>
              </div>
            </div>
          </header>

          <div className="db-scroll">
            {content}
          </div>
        </div>

      </div>
    </>
  );
}