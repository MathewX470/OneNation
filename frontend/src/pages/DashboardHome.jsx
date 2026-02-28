import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function DashboardHome() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const displayName = user?.fullname || user?.email || "Citizen";

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Notification bell — top right */}
      <div className="flex justify-end mb-6">
        <NotificationBell />
      </div>

      {/* Hero greeting — centered */}
      <div className="text-center mb-14">
        <p
          className="text-sm uppercase tracking-[0.25em] font-sans font-semibold mb-3"
          style={{ color: "#B8972E" }}
        >
          {greeting}
        </p>
        <h1 className="text-5xl font-bold leading-tight" style={{ color: "#0F1F3D" }}>
          {displayName}
        </h1>
        <div
          className="mx-auto mt-4 w-16 h-0.5 rounded-full"
          style={{ backgroundColor: "#B8972E" }}
        />
        <p className="mt-4 text-base font-sans tracking-wide" style={{ color: "#4A5568" }}>
          How may we serve you today?
        </p>
      </div>

      {/* Primary action */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <button
          onClick={() => navigate("/dashboard/report")}
          className="w-full group relative overflow-hidden text-white px-10 py-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ backgroundColor: "#0F1F3D" }}
        >
          {/* Gold shimmer on hover */}
          <div
            className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            style={{ background: "linear-gradient(90deg, transparent, rgba(184,151,46,0.12), transparent)" }}
          />

          <div className="flex items-center justify-center gap-3 mb-1">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-semibold tracking-wide" style={{ fontFamily: "sans-serif" }}>
              Report a Civic Issue
            </h2>
          </div>
          <p className="text-sm font-sans mt-1" style={{ color: "#B8972E" }}>
            Submit a complaint or concern in your area
          </p>
        </button>
      </div>

      {/* Secondary actions */}
      <div className="max-w-2xl mx-auto w-full grid grid-cols-2 gap-4">

        <ActionCard
          icon="🗺️"
          title="Nearby Issues"
          subtitle="View issues within 3 km"
          onClick={() => navigate("/dashboard/nearby")}
        />

        <ActionCard
          icon="🩸"
          title="Become a Donor"
          subtitle="Register as a verified donor"
          onClick={() => navigate("/dashboard/donor")}
        />

        <div className="col-span-2">
          <ActionCard
            icon="📁"
            title="Manage My Reports"
            subtitle="Track and update your submissions"
            onClick={() => navigate("/dashboard/manage-reports")}
          />
        </div>

      </div>

      {/* Footer note */}
      <p
        className="text-center text-xs font-sans mt-10 tracking-wide uppercase"
        style={{ color: "#A0AEC0" }}
      >
        OneNation · Unified Digital Governance Platform
      </p>

    </div>
  );
}

function ActionCard({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl px-6 py-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ border: "1px solid #E2E8F0" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#B8972E"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xl">{icon}</span>
        <h3
          className="text-sm font-semibold transition-colors"
          style={{ fontFamily: "sans-serif", color: "#0F1F3D" }}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs font-sans pl-8" style={{ color: "#718096" }}>{subtitle}</p>
    </button>
  );
}

export default DashboardHome;