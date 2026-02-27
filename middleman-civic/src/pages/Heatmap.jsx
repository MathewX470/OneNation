import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import RequestCard from "../components/RequestCard";
import  useMiddleManStore  from "../store/commonStore";
import { useNavigate } from "react-router-dom";

/* ===========================
   Generate Dummy Requests
=========================== */
function generateDummyRequests() {
  const baseLat = 9.9312;
  const baseLng = 76.2673;

  const statuses = ["Pending", "Ongoing", "Completed"];
  const titles = [
    "Pothole",
    "Water Leakage",
    "Garbage Dump",
    "Streetlight Issue",
    "Drainage Block",
  ];

  let data = [];

  for (let i = 1; i <= 120; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    data.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      status,
      location: "Kochi Area",
      lat: baseLat + (Math.random() - 0.5) * 0.05,
      lng: baseLng + (Math.random() - 0.5) * 0.05,
    });
  }

  return data;
}

const requestsData = generateDummyRequests();

/* ===========================
   Convert Status to Intensity
=========================== */
function getIntensity(status) {
  if (status === "Pending") return 1.0;     // Red
  if (status === "Ongoing") return 0.6;     // Orange
  if (status === "Completed") return 0.3;   // Green
  return 0.5;
}

/* ===========================
   Heat Layer
=========================== */
function HeatLayer({ data, onZoneClick }) {
  const map = useMap();

  useEffect(() => {
    const heatPoints = data.map((req) => [
      req.lat,
      req.lng,
      getIntensity(req.status),
    ]);

    const heat = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      gradient: {
        0.2: "green",
        0.5: "yellow",
        0.7: "orange",
        1.0: "red",
      },
    }).addTo(map);

    const handleClick = (e) => {
      const { lat, lng } = e.latlng;

      const nearby = data.filter(
        (req) =>
          Math.abs(req.lat - lat) < 0.01 &&
          Math.abs(req.lng - lng) < 0.01
      );

      onZoneClick(nearby);
    };

    map.on("click", handleClick);

    return () => {
      map.removeLayer(heat);
      map.off("click", handleClick);
    };
  }, [map, data, onZoneClick]);

  return null;
}

/* ===========================
   Main Component
=========================== */
function Heatmap() {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
const {token} = useMiddleManStore(state => state);
const navigate = useNavigate();
useEffect(() => {
  if (!token) {
    navigate("/login");
    return
  }
})
  const filteredRequests =
    statusFilter === "All"
      ? selectedRequests
      : selectedRequests.filter((r) => r.status === statusFilter);

  return (
    <div className="flex h-[calc(100vh-80px)]">

      {/* LEFT SIDEBAR */}
      <div className="w-[340px] min-w-[340px] bg-white border-r shadow-md p-5 overflow-y-auto">

        <h2 className="text-xl font-semibold mb-4">
          Area Requests
        </h2>

        {/* FILTER BUTTONS */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {["All", "Pending", "Ongoing", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-gray-400">
            Click on heat zone to see requests
          </p>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT MAP */}
      <div className="flex-1">
        <MapContainer
          center={[9.9312, 76.2673]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <HeatLayer
            data={requestsData}
            onZoneClick={setSelectedRequests}
          />
        </MapContainer>
      </div>

    </div>
  );
}

export default Heatmap;