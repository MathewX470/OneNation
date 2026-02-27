import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useMiddleManStore from "../store/commonStore";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useMiddleManStore((state) => state);

  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/reports/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReport(res.data.report);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReport();
  }, [id, token, navigate]);

  if (!report) {
    return <div className="p-10">Loading...</div>;
  }

  const handleResolve = async () => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/reports/${id}/status`,
      { status: "Resolved" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReport(res.data.report); // update UI instantly
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/admin")}
        className="mb-6 bg-gray-200 px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        {report.photo && (
          <img
            src={report.photo}
            alt="report"
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        <h1 className="text-2xl font-bold mb-2">{report.subject}</h1>

        <p className="text-gray-600 mb-4">{report.description}</p>

        <p className="mb-2">
          <strong>Status:</strong> {report.status}
        </p>

        <p className="mb-2">
          <strong>Urgency:</strong> {report.urgency}
        </p>

        <p className="mb-2">
          <strong>Upvotes:</strong> {report.upvotes}
        </p>

        <p className="mb-2">
          <strong>Citizen:</strong> {report.userId?.name}
        </p>

        <p className="mb-2">
          <strong>Forwarded By:</strong> {report.middleManID?.name}
        </p>

        <p className="mb-2">
          <strong>Coordinates:</strong> {report.location?.lat},{" "}
          {report.location?.lng}
        </p>

        {report.location?.lat && report.location?.lng && (
  <div className="mt-6">
    <h3 className="font-semibold mb-3">Location Map</h3>

    <MapContainer
      center={[report.location.lat, report.location.lng]}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[report.location.lat, report.location.lng]}>
        <Popup>
          {report.subject}
        </Popup>
      </Marker>
    </MapContainer>
  </div>
)}
{report.status === "In Progress" && (
  <button
    onClick={handleResolve}
    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
  >
    Mark as Resolved
  </button>
)}
        <p className="text-sm text-gray-400 mt-4">
          Submitted on:{" "}
          {new Date(report.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default AdminRequestDetails;