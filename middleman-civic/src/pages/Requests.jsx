import { useState, useEffect } from "react";
import RequestCard from "../components/RequestCard";
import useMiddleManStore from "../store/commonStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Requests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationSearch, setLocationSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("All"); // updated from priorityFilter
  const { token } = useMiddleManStore((state) => state);
  const [dummyRequests, setDummyRequests] = useState([
]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  useEffect(() => {
      const fetchRequests = async () => {
          try{
       const res= await axios.get("http://localhost:5000/api/middleman/all-reports");
       if(res.status===200){
     if (res.status === 200) {

  const normalized = res.data.map((req, index) => ({
    id: req._id || index, // use Mongo _id or fallback index
    subject: req.subject,
    description: req.description,
    status: req.status,
    urgency: req.urgency,
    location: req.locationName || "Unknown Location", // fallback string
    photo: req.photo || null, // random placeholder
    upvotes: req.upvotes ?? 0,
    petition: req.petition ?? false,
  }));
  setDummyRequests(normalized);
}

      }}
      catch(err){
        console.log(err);

      }
      }
      fetchRequests();
  },[])
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
    {/* Search by Title */}
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

    {/* Status Filter */}
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
        <option>Closed</option>
      </select>
    </div>

    

    {/* Location Search */}
    <div>
      <label className="text-sm font-medium text-gray-700">Search by Location</label>
      <input
        type="text"
        placeholder="Enter location..."
        value={locationSearch}
        onChange={(e) => setLocationSearch(e.target.value)}
        className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
      />
    </div>
    {/* Urgency Filter */}
    <div>
  <label className="text-sm font-medium text-gray-700">Filter by Urgency</label>
  <div className="flex gap-4 mt-2">
    <button
      onClick={() => setUrgencyFilter("All")}
      className={`px-4 py-2 text-sm border ${
        urgencyFilter === "All"
          ? "bg-gray-800 text-white border-gray-800"
          : "border-gray-400"
      }`}
    >
      All
    </button>

    <button
      onClick={() => setUrgencyFilter("High")}
      className={`px-4 py-2 text-sm border ${
        urgencyFilter === "High"
          ? "bg-red-700 text-white border-red-700"
          : "border-red-600 text-red-700"
      }`}
    >
      High
    </button>

    <button
      onClick={() => setUrgencyFilter("Medium")}
      className={`px-4 py-2 text-sm border ${
        urgencyFilter === "Medium"
          ? "bg-orange-600 text-white border-orange-600"
          : "border-orange-500 text-orange-600"
      }`}
    >
      Medium
    </button>

    <button
      onClick={() => setUrgencyFilter("Low")}
      className={`px-4 py-2 text-sm border ${
        urgencyFilter === "Low"
          ? "bg-green-700 text-white border-green-700"
          : "border-green-600 text-green-700"
      }`}
    >
      Low
    </button>
  </div>
</div>

  </div>
</div>


        <div className="mb-6 text-sm text-gray-700">
          Total Records: <span className="font-semibold">{filtered.length}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((req) => (
           <RequestCard
    key={req.id}
    request={req}
  />// pass showUpvotes prop
          ))}
        </div>
      </div>
    </div>
  );
}

export default Requests;