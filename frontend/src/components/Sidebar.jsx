import { NavLink, useNavigate } from "react-router-dom";
import VoiceAssistant from "./VoiceAssistant";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

const GoIEmblem = () => (
  <svg viewBox="0 0 100 120" width="38" height="46" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <rect x="18" y="96" width="64" height="7" rx="1" fill={GOLD} />
    <circle cx="50" cy="92" r="6" fill="none" stroke={GOLD} strokeWidth="1.5" />
    <circle cx="50" cy="92" r="1.5" fill={GOLD} />
    {[...Array(12)].map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      return <line key={i} x1={50 + 1.5 * Math.cos(angle)} y1={92 + 1.5 * Math.sin(angle)} x2={50 + 5.5 * Math.cos(angle)} y2={92 + 5.5 * Math.sin(angle)} stroke={GOLD} strokeWidth="0.8" />;
    })}
    <ellipse cx="28" cy="82" rx="9" ry="5" fill={GOLD} />
    <ellipse cx="22" cy="80" rx="5" ry="4" fill={GOLD} />
    <ellipse cx="72" cy="82" rx="9" ry="5" fill={GOLD} />
    <ellipse cx="78" cy="80" rx="5" ry="4" fill={GOLD} />
    <ellipse cx="50" cy="76" rx="10" ry="7" fill={GOLD} />
    <circle cx="50" cy="69" r="7" fill={GOLD} />
    <circle cx="50" cy="68" r="5" fill="#d4a82a" />
    <circle cx="47.5" cy="66.5" r="1" fill={NAVY} />
    <circle cx="52.5" cy="66.5" r="1" fill={NAVY} />
    <circle cx="50" cy="68.5" r="0.7" fill={NAVY} />
    <ellipse cx="44" cy="64" rx="2" ry="2.5" fill={GOLD} />
    <ellipse cx="56" cy="64" rx="2" ry="2.5" fill={GOLD} />
    <line x1="43" y1="68" x2="47" y2="68.5" stroke={NAVY} strokeWidth="0.5" />
    <line x1="57" y1="68" x2="53" y2="68.5" stroke={NAVY} strokeWidth="0.5" />
    <text x="50" y="117" textAnchor="middle" fontSize="5.5" fill={GOLD} fontFamily="serif" letterSpacing="0.5">सत्यमेव जयते</text>
  </svg>
);

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to: "/dashboard/profile", label: "Profile", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { to: "/dashboard/report", label: "Submit Report", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> },
  { to: "/dashboard/nearby", label: "Nearby Issues", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg> },
  { to: "/dashboard/donor", label: "Become Donor", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { to: "/dashboard/manage-reports", label: "Manage Reports", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <aside style={{
      width: "240px", minWidth: "240px",
      backgroundColor: NAVY,
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      borderRight: "1px solid rgba(184,151,46,0.15)",
    }}>
      {/* Logo */}
      <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", marginBottom: "24px", padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <GoIEmblem />
          <div>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff", fontFamily: "Georgia, serif", lineHeight: 1.2 }}>OneNation</div>
            <div style={{ fontSize: "9px", color: "rgba(184,151,46,0.8)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "sans-serif", marginTop: "2px" }}>Digital Governance</div>
          </div>
        </div>
        <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(184,151,46,0.2)", marginTop: "16px" }} />
      </button>

      {/* ── Voice Assistant button ── */}
      <div style={{ padding: "0 4px", marginBottom: "14px" }}>
        <VoiceAssistant />
      </div>

      <div style={{ height: "1px", backgroundColor: "rgba(184,151,46,0.15)", marginBottom: "12px" }} />

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ to, label, end, icon }) => (
          <NavLink key={to} to={to} end={end}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 12px", borderRadius: "8px",
              textDecoration: "none", fontSize: "13px", fontFamily: "sans-serif",
              fontWeight: isActive ? "600" : "400",
              backgroundColor: isActive ? "rgba(184,151,46,0.15)" : "transparent",
              color: isActive ? GOLD : "rgba(255,255,255,0.7)",
              borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
              transition: "all 0.15s",
            })}
          >
            <span style={{ opacity: 0.9 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div style={{ height: "1px", backgroundColor: "rgba(184,151,46,0.15)", margin: "16px 0" }} />

      {/* Logout */}
      <button onClick={handleLogout}
        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "transparent", color: "#F87171", fontSize: "13px", fontFamily: "sans-serif", fontWeight: "500", textAlign: "left", width: "100%" }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.1)"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;