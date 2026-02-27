import { useState, useEffect } from "react";
import statesData from "../assets/states-and-districts.json";
import axios from "axios";
import commonStore from "../store/commonStore";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix Leaflet marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

/* Map Click Component */
function LocationMarker({ lat, lng, setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return lat && lng ? (
    <Marker position={[lat, lng]} />
  ) : null;
}

function Announcements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState("state");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [location, setLocation] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("");

  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India default

const handleUseCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;

        setLat(currentLat);
        setLng(currentLng);
        setMapCenter([currentLat, currentLng]);
      },
      () => {
        alert("Unable to fetch location");
      }
    );
  } else {
    alert("Geolocation not supported");
  }
};

  /* Get districts dynamically */
  const districts =
    statesData.states.find((s) => s.state === selectedState)
      ?.districts || [];

  /* Auto-center map when district changes */
useEffect(() => {
  if (selectedDistrict && selectedState) {
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${selectedDistrict}, ${selectedState}, India`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setMapCenter([
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
          ]);
        }
      });
  }
}, [selectedDistrict, selectedState]);

 const token = commonStore((state) => state.token);

const handleSubmit = async (e) => {
    console.log("BASE:", import.meta.env.VITE_BASE_URL);
console.log("FULL:", `${import.meta.env.VITE_BASE_URL}/announcements`);
  e.preventDefault();

  try {
    const announcementData = {
      title,
      message,
      targetType,
      state: selectedState,
      district: selectedDistrict,
      location,
      geo:
        targetType === "geo"
          ? {
              lat,
              lng,
              radiusKm: radius,
            }
          : null,
    };

    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/announcements`,
      announcementData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Announcement Created Successfully ✅");

    // Reset form
    setTitle("");
    setMessage("");
    setSelectedState("");
    setSelectedDistrict("");
    setLocation("");
    setLat("");
    setLng("");
    setRadius("");

  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message || "Failed to create announcement"
    );
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">
        Create Announcement
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            rows="4"
            className="w-full border rounded-lg px-4 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Target Type */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Target Type
          </label>
          <select
            className="w-full border rounded-lg px-4 py-2"
            value={targetType}
            onChange={(e) => {
              setTargetType(e.target.value);
              setSelectedState("");
              setSelectedDistrict("");
              setLocation("");
              setLat("");
              setLng("");
            }}
          >
            <option value="state">State Level</option>
            <option value="district">District Level</option>
            <option value="location">Location Specific</option>
            <option value="geo">Geo Radius</option>
          </select>
        </div>

        {/* STATE */}
        {(targetType === "state" ||
          targetType === "district" ||
          targetType === "location" ||
          targetType === "geo") && (
          <div>
            <label className="block text-sm font-medium mb-2">
              State
            </label>
            <select
              className="w-full border rounded-lg px-4 py-2"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict("");
              }}
              required
            >
              <option value="">Select State</option>
              {statesData.states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* DISTRICT */}
        {(targetType === "district" ||
          targetType === "location" ||
          targetType === "geo") &&
          selectedState && (
            <div>
              <label className="block text-sm font-medium mb-2">
                District
              </label>
              <select
                className="w-full border rounded-lg px-4 py-2"
                value={selectedDistrict}
                onChange={(e) =>
                  setSelectedDistrict(e.target.value)
                }
                required
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* LOCATION */}
        {targetType === "location" && selectedDistrict && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        )}

        {/* GEO MAP */}
        {targetType === "geo" && selectedDistrict && (
  <>
    <div className="flex justify-between items-center">
      <label className="block text-sm font-medium">
        Click on Map to Pin Location
      </label>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Use Current Location
      </button>
    </div>

    <MapContainer
      center={mapCenter}
      zoom={11}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMapView center={mapCenter} />

      <LocationMarker
        lat={lat}
        lng={lng}
        setLat={setLat}
        setLng={setLng}
      />

      {/* 🔥 Radius Circle */}
      {lat && lng && radius && (
        <Circle
          center={[lat, lng]}
          radius={radius * 1000} // km → meters
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.2,
          }}
        />
      )}
    </MapContainer>

    {/* Lat Lng + Radius */}
    <div className="grid grid-cols-3 gap-4 mt-4">
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        readOnly
        className="border rounded-lg px-4 py-2"
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        readOnly
        className="border rounded-lg px-4 py-2"
      />
      <input
        type="number"
        placeholder="Radius (km)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
        className="border rounded-lg px-4 py-2"
        required
      />
    </div>
  </>
)}

        <button
          type="submit"
          className="w-full bg-[#0B3D91] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Send Announcement
        </button>
      </form>
    </div>
  );
}

export default Announcements;