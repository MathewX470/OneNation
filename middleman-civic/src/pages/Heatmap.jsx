import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import RequestCard from "../components/RequestCard";
import useMiddleManStore from "../store/commonStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ===========================
   Convert Status to Intensity
=========================== */
function getIntensity(status) {
  switch (status) {
    case "Open": return 1.0;
    case "In Progress": return 0.8;
    case "Resolved": return 0.5;
    case "Closed": return 0.4;
    default: return 0.6;
  }
}

/* ===========================
   Heat Layer
=========================== */
function HeatLayer({ data, onZoneClick }) {
  const map = useMap();

  useEffect(() => {
    if (!data.length) return;

    // =========================
    // Heatmap points with minimum intensity
    // =========================
    const heatPoints = data.map((req) => [
      req.location.lat,
      req.location.lng,
      Math.max(getIntensity(req.status), 0.6), // minimum visibility
    ]);

    const heat = L.heatLayer(heatPoints, {
      radius: 45,
      blur: 40,
      maxZoom: 6,
      gradient: {
        0.2: "gray",
        0.3: "green",
        0.6: "orange",
        1.0: "red",
      },
    }).addTo(map);

    // =========================
    // Circle markers for sparse data
    // =========================
    const markers = [];
    if (data.length <= 5) {
      data.forEach((req) => {
        const color =
          req.status === "Open"
            ? "red"
            : req.status === "In Progress"
            ? "orange"
            : req.status === "Resolved"
            ? "green"
            : "gray";

        const circle = L.circle([req.location.lat, req.location.lng], {
          radius: 200, // meters
          color,
          fillColor: color,
          fillOpacity: 0.6,
        }).addTo(map);

        markers.push(circle);
      });
    }

    // =========================
    // Click handler to select nearby requests
    // =========================
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      const nearby = data.filter(
        (req) =>
          Math.abs(req.location.lat - lat) < 0.01 &&
          Math.abs(req.location.lng - lng) < 0.01
      );
      onZoneClick(nearby);
    };

    map.on("click", handleClick);

    // =========================
    // Fit map bounds to all points
    // =========================
    const group = new L.featureGroup(
      data.map((req) => L.marker([req.location.lat, req.location.lng]))
    );
    map.fitBounds(group.getBounds().pad(0.5));

    // =========================
    // Cleanup
    // =========================
    return () => {
      map.removeLayer(heat);
      markers.forEach((m) => map.removeLayer(m));
      map.off("click", handleClick);
    };
  }, [map, data, onZoneClick]);

  return null;
}
/* ===========================
   Main Component
=========================== */
function Heatmap() {
  const [requests, setRequests] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const { token } = useMiddleManStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch reports from backend
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/middleman/all-reports");
        setRequests(response.data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, [token, navigate]);

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
          {["All", "Open", "In Progress", "Resolved", "Closed"].map((status) => (
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
              <RequestCard key={req._id} request={req} />
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
            data={requests}
            onZoneClick={setSelectedRequests}
          />
        </MapContainer>
      </div>

    </div>
  );
}

export default Heatmap; 