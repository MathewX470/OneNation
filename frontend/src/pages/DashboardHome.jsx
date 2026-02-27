import { useNavigate } from "react-router-dom";

function DashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
    
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, User
        </h1>
        <p className="text-gray-500 mt-2">
          What would you like to do today?
        </p>
      </div>

      {/* PRIMARY ACTION */}
      <button
        onClick={() => navigate("/dashboard/report")}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 text-white p-10 rounded-2xl text-center"
      >
        <h2 className="text-2xl font-semibold">
          Report an Issue
        </h2>
        <p className="mt-2 text-sm opacity-90">
          Submit a civic complaint in your area
        </p>
      </button>

      {/* SECONDARY ACTIONS */}
      <div className="grid grid-cols-2 gap-6">

        <button
          onClick={() => navigate("/dashboard/nearby")}
          className="bg-white border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            View Nearby Issues
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            See issues within 3 km
          </p>
        </button>

        <button
          onClick={() => navigate("/dashboard/donor")}
          className="bg-white border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Become a Donor
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Register as verified donor
          </p>
        </button>

        <button
          onClick={() => navigate("/dashboard/manage-reports")}
          className="bg-white border rounded-xl p-6 text-center col-span-2 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
          <h3 className="text-lg font-semibold text-gray-800">
            Manage My Reports
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track and update your submissions
          </p>
        </button>

      </div>

    </div>
  );
}

export default DashboardHome;