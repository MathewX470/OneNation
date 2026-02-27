import { useState } from "react";
import RequestCard from "../components/RequestCard";

const dummyRequests = [
  {
    id: 1,
    title: "Pothole on MG Road",
    status: "Pending",
    location: "MG Road",
    image: "https://images.unsplash.com/photo-1597764699512-1e7f6c8e6d69"
  },
  {
    id: 2,
    title: "Water leakage near park",
    status: "Ongoing",
    location: "Central Park",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 3,
    title: "Garbage not collected",
    status: "Completed",
    location: "Town Hall",
    image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807"
  },
  {
    id: 4,
    title: "Streetlight not working",
    status: "Pending",
    location: "Beach Road",
    image: null
  },
  {
    id: 5,
    title: "Broken drainage",
    status: "Ongoing",
    location: "Market Area",
    image: "https://images.unsplash.com/photo-1581090700227-1e8a2e2f6c25"
  },
];
function Requests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);

  const filtered = dummyRequests
    .filter((req) =>
      statusFilter === "All" ? true : req.status === statusFilter
    )
    .filter((req) =>
      req.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((req) =>
      req.location.toLowerCase().includes(locationSearch.toLowerCase())
    );

  return (
    <div className="max-w-6xl mx-auto p-6">

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

          {/* Filter Button inside input */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm"
          >
            Filter ▼
          </button>

          {/* Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-3 bg-white shadow-xl rounded-xl p-4 w-64 z-10">

              {["All", "Pending", "Ongoing", "Completed"].map((status) => (
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
          <RequestCard key={req.id} request={req} />
        ))}
      </div>

    </div>
  );
}

export default Requests;