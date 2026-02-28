import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const linkStyle =
    "block px-4 py-3 rounded-lg transition text-sm font-medium";

  return (
    <div className="w-64 bg-[#0B3D91] text-white p-6">
      <h2 className="text-xl font-bold mb-8">Super Admin</h2>

      <nav className="space-y-3">
        <NavLink
          to="/super-admin"
          end
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/super-admin/department-admins"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          Department Admins
        </NavLink>

        <NavLink
          to="/super-admin/middlemen"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          Middlemen
        </NavLink>

        <NavLink
          to="/super-admin/reports"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          All Reports
        </NavLink>

        <NavLink
          to="/super-admin/announcements"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          Announcements
        </NavLink>

        <NavLink
          to="/super-admin/logs"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? "bg-white text-[#0B3D91]" : "hover:bg-blue-800"}`
          }
        >
          System Logs
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminSidebar;