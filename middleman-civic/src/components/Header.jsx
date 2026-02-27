import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="bg-[#0B3D91] text-white shadow-md">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT – Logo + Dept */}
        <div className="flex items-center gap-4">

          {/* Logo Placeholder */}
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-[#0B3D91] font-bold">
            LOGO
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              Civic Management System
            </h1>
            <p className="text-xs opacity-80">
              Department of Public Infrastructure
            </p>
          </div>
        </div>

        {/* RIGHT – Navigation */}
        <div className="flex gap-10 text-sm font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-white pb-1"
                : "hover:opacity-80"
            }
          >
            Requests
          </NavLink>

          <NavLink
            to="/heatmap"
            className={({ isActive }) =>
              isActive
                ? "border-b-2 border-white pb-1"
                : "hover:opacity-80"
            }
          >
            Heatmap Monitoring
          </NavLink>

        </div>

        {/* Admin Badge */}
        <div className="bg-white text-[#0B3D91] px-4 py-1 rounded text-sm font-semibold">
          Admin Panel
        </div>

      </div>
    </div>
  );
}

export default Header;