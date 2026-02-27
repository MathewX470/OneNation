import { NavLink } from "react-router-dom";

function Header() {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-center gap-10 py-6">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-lg font-medium transition-all ${
              isActive
                ? "text-blue-600 border-b-4 border-blue-600 pb-2"
                : "text-gray-500 hover:text-blue-500"
            }`
          }
        >
          Requests
        </NavLink>

        <NavLink
          to="/heatmap"
          className={({ isActive }) =>
            `text-lg font-medium transition-all ${
              isActive
                ? "text-blue-600 border-b-4 border-blue-600 pb-2"
                : "text-gray-500 hover:text-blue-500"
            }`
          }
        >
          Heatmap
        </NavLink>

      </div>
    </div>
  );
}

export default Header;