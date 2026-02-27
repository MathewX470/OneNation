import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import commonStore from "../store/commonStore";
function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
const role = localStorage.getItem("role");
const department = localStorage.getItem("department");
const logout=commonStore(state=>state.logout);
  const handleLogout = () => {
    
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-[#0B3D91] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LEFT – Logo + Title */}
        <div className="flex items-center gap-4">
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

        {/* CENTER – Navigation */}
        {role && (
  <div className="flex gap-10 text-sm font-medium">

    {/* Middleman Navigation */}
    {role === "middleman" && (
      <>
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
      </>
    )}

    {/* Department Admin Navigation */}
    {role === "department_admin" && (
      <NavLink
        to="/admin"
        className={({ isActive }) =>
          isActive
            ? "border-b-2 border-white pb-1"
            : "hover:opacity-80"
        }
      >
        Admin Dashboard
      </NavLink>
    )}

  </div>
)}

        {/* RIGHT – Profile Dropdown */}
        {role ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-white text-[#0B3D91] px-4 py-1 rounded text-sm font-semibold"
            >
              {role === "department_admin"
                ? `Admin (${department})`
                : "Middleman"}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 bg-white text-black shadow-lg rounded-lg w-40 overflow-hidden">
                <div className="px-4 py-2 text-sm border-b">
                  {role}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-[#0B3D91] px-4 py-1 rounded text-sm font-semibold"
          >
            Login
          </button>
        )}

      </div>
    </div>
  );
}

export default Header;