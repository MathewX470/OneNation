import { useState, useEffect, useMemo } from "react";
import axios from "axios";

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // ================= FETCH MY REPORTS =================
  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/reports/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReports(res.data.reports);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch reports");
        setLoading(false);
      }
    };

    fetchMyReports();
  }, []);

  // ================= FILTER + SEARCH =================
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.subject.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report._id.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || report.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [reports, search, filter]);

  const statusStyles = {
    Open: "bg-yellow-50 border-yellow-200",
    "In Progress": "bg-blue-50 border-blue-200",
    Resolved: "bg-green-50 border-green-200",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold text-center">
        Manage My Reports
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">

        <input
          type="text"
          placeholder="Search by subject, description, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading your reports...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredReports.map((report) => (
            <div
              key={report._id}
              className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
                statusStyles[report.status] || "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Subject */}
              <h2 className="text-lg font-semibold mb-2">
                {report.subject}
              </h2>

              {/* Short Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {report.description}
              </p>

              {/* ID */}
              <p className="text-xs text-gray-400 mb-2">
                ID: {report._id.slice(-6)}
              </p>

              {/* Upvotes */}
              <p className="text-sm text-gray-700 mb-3">
                👍 Upvotes: {report.upvotes}
              </p>

              {/* Status */}
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white border">
                {report.status}
              </span>

            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No reports found.
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default ManageReports;