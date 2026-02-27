import { useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RequestCard from "../components/RequestCard";

const dummyRequests = [
  {
    id: 1,
    title: "Pothole on MG Road",
    status: "Pending",
    location: "MG Road",
    lat: 9.9312,
    lng: 76.2673,
  },
  {
    id: 2,
    title: "Water leakage near park",
    status: "Ongoing",
    location: "Central Park",
    lat: 9.9320,
    lng: 76.2680,
  },
  {
    id: 3,
    title: "Garbage not collected",
    status: "Completed",
    location: "Town Hall",
    lat: 9.9500,
    lng: 76.2500,
  },
];

function HeatLayer({ data, onClusterClick }) {
  const map = useMap();

  data.forEach((req) => {
    const circle = L.circle([req.lat, req.lng], {
      radius: 500,
      color: "red",
      fillColor: "red",
      fillOpacity: 0.4,
    }).addTo(map);

    circle.on("click", () => {
      onClusterClick(req);
    });
  });

  return null;
}

function Heatmap() {
  const [selectedRequests, setSelectedRequests] = useState([]);

  const handleClusterClick = (clickedRequest) => {
    // Filter nearby requests (simple radius logic)
    const nearby = dummyRequests.filter(
      (req) =>
        Math.abs(req.lat - clickedRequest.lat) < 0.01 &&
        Math.abs(req.lng - clickedRequest.lng) < 0.01
    );

    setSelectedRequests(nearby);
  };

  return (
    <div className="flex h-[90vh]">

      {/* Sidebar */}
      <div className="w-1/3 bg-white shadow-xl p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Area Requests
        </h2>

        {selectedRequests.length === 0 && (
          <p className="text-gray-400">
            Click a heat area to see requests
          </p>
        )}

        <div className="space-y-4">
          {selectedRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-2/3">
        <MapContainer
          center={[9.9312, 76.2673]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <HeatLayer
            data={dummyRequests}
            onClusterClick={handleClusterClick}
          />
        </MapContainer>
      </div>
    </div>
  );
}

export default Heatmap;