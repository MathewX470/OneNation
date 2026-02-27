import { useState, useMemo } from "react";

function ManageReports() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const reports = [
    {
      id: "RPT-101",
      title: "Pothole near Metro Station",
      location: "MG Road",
      status: "Ongoing",
    },
    {
      id: "RPT-102",
      title: "Streetlight not working",
      location: "Kaloor",
      status: "Completed",
    },
    {
      id: "RPT-103",
      title: "Garbage overflow",
      location: "Market Area",
      status: "Pending",
    },
    {
      id: "RPT-104",
      title: "Water leakage issue",
      location: "Panampilly Nagar",
      status: "Declined",
    },
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.location.toLowerCase().includes(search.toLowerCase()) ||
        report.id.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || report.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const statusStyles = {
    Pending: "bg-yellow-50 border-yellow-200",
    Ongoing: "bg-blue-50 border-blue-200",
    Completed: "bg-green-50 border-green-200",
    Declined: "bg-red-50 border-red-200",
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
          placeholder="Search by title, location, ID..."
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
          <option>Pending</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Declined</option>
        </select>

      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={`border rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
              statusStyles[report.status]
            }`}
          >
            <h2 className="text-lg font-semibold mb-2">
              {report.title}
            </h2>

            <p className="text-sm text-gray-500 mb-1">
              ID: {report.id}
            </p>

            <p className="text-sm text-gray-600 mb-3">
              Location: {report.location}
            </p>

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

    </div>
  );
}

export default ManageReports;