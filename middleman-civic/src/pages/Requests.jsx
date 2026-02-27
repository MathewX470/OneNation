import { useState } from "react";
import RequestCard from "../components/RequestCard";

const dummyRequests = [
  {
    id: 1,
    title: "Pothole on MG Road",
    status: "Pending",
    priority: "High",
    location: "MG Road",
    image: "https://images.unsplash.com/photo-1597764699512-1e7f6c8e6d69"
  },
  {
    id: 2,
    title: "Water leakage near park",
    status: "Ongoing",
    priority: "Medium",
    location: "Central Park",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 3,
    title: "Garbage not collected",
    status: "Completed",
    priority: "Low",
    location: "Town Hall",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 4,
    title: "Streetlight not working",
    status: "Pending",
    priority: "High",
    location: "Beach Road",
    image: null
  },
  {
    id: 5,
    title: "Broken drainage",
    status: "Ongoing",
    priority: "Medium",
    location: "Market Area",
    image: "https://images.unsplash.com/photo-1581090700227-1e8a2e2f6c25"
  },
];
function Requests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
const [priorityFilter, setPriorityFilter] = useState("All");
 const filtered = dummyRequests
  .filter((req) =>
    statusFilter === "All" ? true : req.status === statusFilter
  )
  .filter((req) =>
    priorityFilter === "All" ? true : req.priority === priorityFilter
  )
  .filter((req) =>
    req.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((req) =>
    req.location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="bg-[#F5F7FA] min-h-screen">

      {/* PAGE CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0B3D91]">
            Citizen Grievance Records
          </h2>
          <p className="text-sm text-gray-600">
            Official Administrative Monitoring Dashboard
          </p>
        </div>

        {/* CONTROL PANEL */}
        <div className="bg-white border border-gray-300 p-6 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Search by Title
              </label>
              <input
                type="text"
                placeholder="Enter issue title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Filter by Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

          </div>

          {/* Logo Upload */}
       
{/* PRIORITY FILTER SECTION */}
<div className="mt-8 pt-6 border-t border-gray-300">

  <label className="text-sm font-semibold text-gray-700 block mb-3">
    Filter by Priority
  </label>

  <div className="flex gap-4">

    <button
      onClick={() => setPriorityFilter("All")}
      className={`px-4 py-2 text-sm border ${
        priorityFilter === "All"
          ? "bg-gray-800 text-white border-gray-800"
          : "border-gray-400"
      }`}
    >
      All
    </button>

    <button
      onClick={() => setPriorityFilter("High")}
      className={`px-4 py-2 text-sm border ${
        priorityFilter === "High"
          ? "bg-red-700 text-white border-red-700"
          : "border-red-600 text-red-700"
      }`}
    >
      High
    </button>

    <button
      onClick={() => setPriorityFilter("Medium")}
      className={`px-4 py-2 text-sm border ${
        priorityFilter === "Medium"
          ? "bg-orange-600 text-white border-orange-600"
          : "border-orange-500 text-orange-600"
      }`}
    >
      Medium
    </button>

    <button
      onClick={() => setPriorityFilter("Low")}
      className={`px-4 py-2 text-sm border ${
        priorityFilter === "Low"
          ? "bg-green-700 text-white border-green-700"
          : "border-green-600 text-green-700"
      }`}
    >
      Low
    </button>

  </div>

</div>
        </div>

        {/* SUMMARY */}
        <div className="mb-6 text-sm text-gray-700">
          Total Records: <span className="font-semibold">{filtered.length}</span>
        </div>

        {/* RECORD GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default Requests;