import { useState, useEffect } from "react";
import RequestCard from "../components/RequestCard";
import { useNavigate } from "react-router-dom";
import useMiddleManStore from "../store/commonStore";
import axios from "axios";

function AdminRequests() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const navigate = useNavigate();
  const { token } = useMiddleManStore((state) => state);

  // 🔥 Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReports = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/reports/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReports(res.data.reports);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, [token, navigate]);

  // 🔥 Apply filters (status already In Progress from backend)
  const filtered = reports
    .filter((req) =>
      statusFilter === "All" ? true : req.status === statusFilter
    )
    .filter((req) =>
      req.subject.toLowerCase().includes(search.toLowerCase())
    )
    .filter((req) =>
      locationSearch
        ? `${req.location?.lat}`.includes(locationSearch)
        : true
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Department Requests (In Progress)
      </h1>

      {/* Search + Filter */}
      <div className="flex justify-center mb-10 relative">
        <div className="relative w-[500px]">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full px-5 py-3 pr-28 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          {/* Filter Button */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm"
          >
            Filter ▼
          </button>

          {/* Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-xl p-4 w-64 z-10">
              {["All", "In Progress", "Resolved"].map((status) => (
                <div
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowLocationInput(false);
                    setShowFilter(false);
                  }}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-md"
                >
                  {status}
                </div>
              ))}

              <hr className="my-3" />

              <div
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                Location
              </div>

              {showLocationInput && (
                <input
                  type="text"
                  placeholder="Search location..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="mt-3 border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((req) => (
  <RequestCard
    key={req._id}
    request={req}
    isAdmin={true}
  />
))}
      </div>
    </div>
  );
}

export default AdminRequests;