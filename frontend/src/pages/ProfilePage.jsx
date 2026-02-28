import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

const inputStyle = {
  width: "100%", border: "1px solid #D1C9B8", borderRadius: "8px",
  padding: "9px 13px", fontSize: "14px", backgroundColor: "#FDFBF7",
  color: NAVY, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "11px", fontWeight: "600", color: "#8A7E6E",
  textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "sans-serif",
};

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [donor, setDonor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [displayAddress, setDisplayAddress] = useState("");
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setDonor(data.donorVerification);
      if (data.user?.lat && data.user?.lng) {
        const loc = { lat: data.user.lat, lng: data.user.lng };
        setCoords(loc);
        setGeocoding(true);
        const address = await reverseGeocode(loc.lat, loc.lng);
        setDisplayAddress(address);
        setGeocoding(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCoordsChange = async (newCoords) => {
    setCoords(newCoords);
    setGeocoding(true);
    const address = await reverseGeocode(newCoords.lat, newCoords.lng);
    setDisplayAddress(address);
    setGeocoding(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);

    let watchId = null;
    let bestAccuracy = Infinity;

    // Give up after 12s with whatever best position was found
    const giveUpTimer = setTimeout(() => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      setLocating(false);
    }, 12000);

    // watchPosition keeps refining until we get a good GPS fix
    watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const loc = { lat: latitude, lng: longitude };

        // Update marker live as GPS refines position
        setCoords(loc);
        if (mapRef.current) {
          mapRef.current.flyTo([loc.lat, loc.lng], 17, { duration: 0.8 });
        }

        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
        }

        // Accept once within 50m — reliably distinguishes Kerala from Delhi
        if (accuracy <= 50) {
          clearTimeout(giveUpTimer);
          navigator.geolocation.clearWatch(watchId);
          await handleCoordsChange(loc);
          if (mapRef.current) {
            mapRef.current.flyTo([loc.lat, loc.lng], 17, { duration: 1.2 });
          }
          setLocating(false);
        }
      },
      (err) => {
        clearTimeout(giveUpTimer);
        setLocating(false);
        if (err.code === 1) {
          alert("Location access denied. Please allow location access in your browser settings.");
        } else if (err.code === 2) {
          alert("Location unavailable. Make sure device location is turned on.");
        } else {
          alert("Location timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true, // request GPS, not IP/WiFi
        maximumAge: 0,            // never use a stale cached position
        timeout: 12000,
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const savedLat = coords?.lat ?? user.lat;
      const savedLng = coords?.lng ?? user.lng;
      const payload = { ...user, lat: savedLat, lng: savedLng };
      const { data } = await axios.put(`${API}/users/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setEditing(false);

      // Refresh the displayed address from the saved coordinates
      if (savedLat && savedLng) {
        setGeocoding(true);
        const address = await reverseGeocode(savedLat, savedLng);
        setDisplayAddress(address);
        setCoords({ lat: savedLat, lng: savedLng });
        setGeocoding(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (user?.lat && user?.lng) setCoords({ lat: user.lat, lng: user.lng });
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", color: NAVY, fontFamily: "sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif" }}>
        No user found
      </div>
    );
  }

  const mapCenter = coords ? [coords.lat, coords.lng] : [9.9312, 76.2673];

  const sectionStyle = {
    backgroundColor: "#fff", borderRadius: "16px", padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E8E0D4",
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ ...sectionStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: 0 }}>
            My Profile
          </h1>
          <div style={{ width: "32px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", marginTop: "8px" }} />
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            style={{ padding: "9px 20px", borderRadius: "8px", border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: "#fff", fontSize: "13px", fontWeight: "600", fontFamily: "sans-serif", cursor: "pointer" }}
          >
            Edit Profile
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCancelEdit}
              style={{ padding: "9px 20px", borderRadius: "8px", border: "1px solid #D1C9B8", backgroundColor: "#FDFBF7", color: "#6B5E4E", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: "9px 20px", borderRadius: "8px", border: "none", backgroundColor: "#166534", color: "#fff", fontSize: "13px", fontWeight: "600", fontFamily: "sans-serif", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", padding: "12px 16px", borderRadius: "10px", fontSize: "13px", fontFamily: "sans-serif" }}>
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8A7E6E", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "sans-serif", margin: "0 0 20px" }}>
          Personal Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { label: "Full Name", name: "fullname" },
            { label: "Phone Number", name: "phoneNo" },
            { label: "Email", name: "email" },
            { label: "Pincode", name: "pincode" },
            { label: "Aadhar", name: "aadhar" },
          ].map(({ label, name }) => (
            <div key={name}>
              <p style={labelStyle}>{label}</p>
              {editing ? (
                <input
                  type="text"
                  name={name}
                  value={user[name] || ""}
                  onChange={handleChange}
                  style={{ ...inputStyle, marginTop: "4px" }}
                />
              ) : (
                <p style={{ margin: "4px 0 0", fontSize: "15px", fontWeight: "500", color: NAVY, fontFamily: "sans-serif" }}>
                  {user[name] || <span style={{ color: "#A0927E", fontStyle: "italic" }}>Not set</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8A7E6E", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "sans-serif", margin: "0 0 16px" }}>
          My Location
        </h2>

        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: editing ? "16px" : 0 }}>
          <span style={{ fontSize: "16px", marginTop: "1px" }}>📍</span>
          <p style={{ fontSize: "14px", color: "#3D3028", lineHeight: "1.6", fontFamily: "sans-serif", margin: 0 }}>
            {geocoding
              ? "Fetching address..."
              : displayAddress || <span style={{ color: "#A0927E", fontStyle: "italic" }}>No location set</span>}
          </p>
        </div>

        {editing && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            <p style={{ fontSize: "12px", color: "#8A7E6E", fontFamily: "sans-serif", margin: 0 }}>
              Click anywhere on the map to pin your location, or use the button below for GPS detection.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={locating}
                style={{
                  padding: "8px 16px", borderRadius: "7px",
                  border: "1px solid #D1C9B8",
                  backgroundColor: locating ? "#F0EDE8" : "#FDFBF7",
                  color: locating ? "#A0927E" : NAVY,
                  fontSize: "12px", fontFamily: "sans-serif",
                  cursor: locating ? "not-allowed" : "pointer",
                  fontWeight: "500", display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {locating ? (
                  <>
                    <span style={{
                      display: "inline-block", width: "12px", height: "12px",
                      border: "2px solid #A0927E", borderTopColor: "transparent",
                      borderRadius: "50%", animation: "spin 0.7s linear infinite",
                    }} />
                    Getting GPS fix...
                  </>
                ) : (
                  <>📍 Use My Current Location</>
                )}
              </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <div style={{ border: "1px solid #D1C9B8", borderRadius: "10px", overflow: "hidden" }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "320px", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationPicker onPick={handleCoordsChange} />
                {coords && <Marker position={[coords.lat, coords.lng]} />}
              </MapContainer>
            </div>

            {coords && (
              <p style={{ fontSize: "11px", color: "#A0927E", fontFamily: "sans-serif", margin: 0 }}>
                📌 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Verified Donor */}
      {user.isVerifiedDonor && donor?.status === "VERIFIED" && (
        <div style={{ ...sectionStyle, backgroundColor: "#FFF5F5", border: "1px solid #FECACA" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#B91C1C", fontFamily: "Georgia, serif", margin: "0 0 20px" }}>
            🩸 Verified Blood Donor
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Blood Group", value: donor.bloodGroup },
              { label: "Hospital", value: donor.hospital?.name },
              { label: "District", value: donor.hospital?.district },
              { label: "State", value: donor.hospital?.state },
              { label: "Verified On", value: new Date(donor.verifiedAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ ...labelStyle, margin: "0 0 4px" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: NAVY, fontFamily: "sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProfilePage;
