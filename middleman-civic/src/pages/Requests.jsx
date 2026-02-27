import { useState, useEffect } from "react";
import RequestCard from "../components/RequestCard";
import useMiddleManStore from "../store/commonStore";
import { useNavigate } from "react-router-dom";

const dummyRequests = [
  {
    id: 1,
    subject: "Pothole on MG Road",
    description: "Huge pothole near the bus stop. Vehicles are at risk.",
    status: "Open",
    urgency: "High",
    location: "MG Road",
    photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    upvotes: 5,
    petition: true,
  },
  {
    id: 2,
    subject: "Water leakage near park",
    description: "Continuous water leakage near Central Park. Needs urgent attention.",
    status: "In Progress",
    urgency: "Medium",
    location: "Central Park",
    photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    upvotes: 3,
    petition: false,
  },
  {
    id: 3,
    subject: "Garbage not collected",
    description: "Garbage in front of Town Hall not collected for a week.",
    status: "Resolved",
    urgency: "Low",
    location: "Town Hall",
    photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    upvotes: 8,
    petition: true,
  },
  {
    id: 4,
    subject: "Streetlight not working",
    description: "Streetlight on Beach Road is not working at night.",
    status: "Open",
    urgency: "High",
    location: "Beach Road",
    photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    upvotes: 2,
    petition: false,
  },
  {
    id: 5,
    subject: "Broken drainage",
    description: "Drainage in Market Area is blocked causing waterlogging.",
    status: "In Progress",
    urgency: "Medium",
    location: "Market Area",
    photo: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    upvotes: 6,
    petition: true,
  },
];

function Requests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("All"); // updated from priorityFilter
  const { token } = useMiddleManStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const filtered = dummyRequests
    .filter((req) => (statusFilter === "All" ? true : req.status === statusFilter))
    .filter((req) => (urgencyFilter === "All" ? true : req.urgency === urgencyFilter))
    .filter((req) => req.subject.toLowerCase().includes(search.toLowerCase()))
    .filter((req) => req.location.toLowerCase().includes(locationSearch.toLowerCase()));

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0B3D91]">Citizen Grievance Records</h2>
          <p className="text-sm text-gray-600">Official Administrative Monitoring Dashboard</p>
        </div>

        <div className="bg-white border border-gray-300 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Search by Title</label>
              <input
                type="text"
                placeholder="Enter issue title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              >
                <option>All</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Urgency</label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
              >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-700">
          Total Records: <span className="font-semibold">{filtered.length}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((req) => (
            <RequestCard key={req.id} request={req} showUpvotes={true} /> // pass showUpvotes prop
          ))}
        </div>
      </div>
    </div>
  );
}

export default Requests;