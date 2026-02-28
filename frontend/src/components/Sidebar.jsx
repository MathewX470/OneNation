import { NavLink, useNavigate } from "react-router-dom";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", end: true, icon: "🏠" },
    { to: "/dashboard/profile", label: "Profile", icon: "👤" },
    { to: "/dashboard/report", label: "Submit Report", icon: "📋" },
    { to: "/dashboard/nearby", label: "Nearby Issues", icon: "🗺️" },
    { to: "/dashboard/donor", label: "Become Donor", icon: "🩸" },
    { to: "/dashboard/manage-reports", label: "Manage Reports", icon: "📁" },
  ];

  return (
    <aside style={{
      width: "240px", minWidth: "240px",
      backgroundColor: NAVY,
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      borderRight: "1px solid rgba(184,151,46,0.15)",
    }}>
      {/* Logo */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left", marginBottom: "36px", padding: "0 8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>🏛️</span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#fff", fontFamily: "Georgia, serif" }}>
            OneNation
          </span>
        </div>
        <div style={{ width: "32px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", marginTop: "6px", marginLeft: "30px" }} />
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map(({ to, label, end, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
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
            <span style={{ fontSize: "14px" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "rgba(184,151,46,0.15)", margin: "16px 0" }} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "9px 12px", borderRadius: "8px", border: "none",
          cursor: "pointer", backgroundColor: "transparent",
          color: "#F87171", fontSize: "13px", fontFamily: "sans-serif",
          fontWeight: "500", textAlign: "left", width: "100%",
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(248,113,113,0.1)"}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
      >
        <span style={{ fontSize: "14px" }}>🚪</span>
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;