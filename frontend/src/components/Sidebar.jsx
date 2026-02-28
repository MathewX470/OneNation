import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const linkBase =
    "block px-4 py-2 rounded-lg transition text-sm font-medium";

  const active =
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow";

  const inactive =
    "text-gray-700 hover:bg-gray-100 hover:translate-x-1 transition-all";

  return (
    <aside className="w-64 bg-white border-r flex flex-col p-6">

      {/* Home Logo */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-bold text-blue-700 mb-10 text-left hover:opacity-80 transition"
      >
        OneNation
      </button>

      <nav className="space-y-3">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Profile
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/report"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Submit Report
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/nearby"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Nearby Issues
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/donor"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Become Donor
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/manage-reports"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : inactive}`
              }
            >
              Manage Reports
            </NavLink>
          </li>
        </ul>
      </nav>

    </aside>
  );
}

export default Sidebar;