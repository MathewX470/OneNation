import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

function LocationPicker({ setLatLng }) {
  useMapEvents({ click(e) { setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return null;
}

function FlyToLocation({ target }) {
  const map = useMap();
  if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
  return null;
}

const inputStyle = {
  width: "100%", border: "1px solid #D1C9B8", borderRadius: "8px",
  padding: "10px 14px", fontSize: "14px", backgroundColor: "#FDFBF7",
  color: NAVY, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  display: "block", fontSize: "12px", fontWeight: "600",
  color: "#6B5E4E", marginBottom: "6px", fontFamily: "sans-serif",
  textTransform: "uppercase", letterSpacing: "0.06em",
};

function SubmitReport() {
  const location = useLocation();
  const prefill = location.state?.prefill;

  const [coordinates, setCoordinates] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [voiceFilled, setVoiceFilled] = useState(false);
  const [formData, setFormData] = useState({
    subject: "", description: "", urgency: "Medium", petition: true, photo: null,
  });

  // ── Apply prefill from voice assistant ────────────────────────────────────
  useEffect(() => {
    if (prefill) {
      setFormData((prev) => ({
        ...prev,
        subject: prefill.subject || prev.subject,
        description: prefill.description || prev.description,
        urgency: prefill.urgency || prev.urgency,
      }));
      setVoiceFilled(true);
      // Clear nav state so refresh doesn't re-apply
      window.history.replaceState({}, "");
    }
  }, [prefill]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else if (type === "file") setFormData({ ...formData, [name]: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoordinates(loc); setFlyTarget(loc);
      },
      () => alert("Unable to retrieve your location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) { alert("Please fill all required fields."); return; }
    if (!coordinates) { alert("Please select a location on the map."); return; }
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("subject", formData.subject);
      data.append("description", formData.description);
      data.append("urgency", formData.urgency || "Medium");
      data.append("petition", formData.petition);
      data.append("lat", coordinates.lat);
      data.append("lng", coordinates.lng);
      if (formData.photo) data.append("photo", formData.photo);

      await axios.post("http://localhost:5000/api/reports", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("Report submitted successfully.");
      setFormData({ subject: "", description: "", urgency: "Medium", petition: true, photo: null });
      setCoordinates(null); setFlyTarget(null); setVoiceFilled(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: 0 }}>
          Submit a Civic Issue
        </h1>
        <div style={{ width: "40px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", margin: "10px auto 0" }} />
      </div>

      {/* Voice-filled banner */}
      {voiceFilled && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
          fontFamily: "sans-serif",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p style={{ margin: 0, fontSize: "13px", color: "#166534", fontWeight: "500" }}>
            Form pre-filled by Voice Assistant — please review and pin the location before submitting.
          </p>
          <button onClick={() => setVoiceFilled(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#16a34a", fontSize: "14px" }}>✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: "#fff", borderRadius: "18px", padding: "36px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        border: "1px solid #E8E0D4", display: "flex", flexDirection: "column", gap: "24px",
      }}>

        <div>
          <label style={labelStyle}>Subject *</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange}
            required minLength={5} maxLength={100} placeholder="Short summary of the issue"
            style={{ ...inputStyle, ...(voiceFilled && formData.subject ? { borderColor: "#86efac", backgroundColor: "#f0fdf4" } : {}) }}
          />
        </div>

        <div>
          <label style={labelStyle}>Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange}
            required minLength={10} maxLength={1000} rows={5}
            placeholder="Provide detailed information about the issue"
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6", ...(voiceFilled && formData.description ? { borderColor: "#86efac", backgroundColor: "#f0fdf4" } : {}) }}
          />
        </div>

        <div>
          <label style={labelStyle}>Upload Photo (Optional)</label>
          <label style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px dashed #D1C9B8", borderRadius: "10px", padding: "24px",
            cursor: "pointer", color: "#8A7E6E", fontSize: "13px",
            fontFamily: "sans-serif", transition: "border-color 0.2s", backgroundColor: "#FDFBF7",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#D1C9B8"}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
            {formData.photo ? formData.photo.name : "Click to upload an image"}
            <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
          </label>
        </div>

        <div>
          <label style={labelStyle}>Location *</label>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
            <button type="button" onClick={handleCurrentLocation}
              style={{
                padding: "7px 14px", borderRadius: "7px", border: "1px solid #D1C9B8",
                backgroundColor: "#FDFBF7", color: NAVY, fontSize: "12px",
                fontFamily: "sans-serif", cursor: "pointer", fontWeight: "500",
                display: "flex", alignItems: "center", gap: "6px",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1C9B8"; e.currentTarget.style.color = NAVY; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              Use My Current Location
            </button>
          </div>
          <div style={{ border: "1px solid #D1C9B8", borderRadius: "10px", overflow: "hidden" }}>
            <MapContainer center={[9.9312, 76.2673]} zoom={13} style={{ height: "280px", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker setLatLng={setCoordinates} />
              <FlyToLocation target={flyTarget} />
              {coordinates && <Marker position={[coordinates.lat, coordinates.lng]} />}
            </MapContainer>
          </div>
          <p style={{ fontSize: "12px", marginTop: "8px", fontFamily: "sans-serif", color: coordinates ? "#6B5E4E" : "#A0927E" }}>
            {coordinates
              ? `Pinned: ${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
              : "Click on the map or use your current location to pin the issue"}
          </p>
        </div>

        <div>
          <label style={labelStyle}>Urgency Level</label>
          <select name="urgency" value={formData.urgency} onChange={handleChange}
            style={{ ...inputStyle, cursor: "pointer", ...(voiceFilled ? { borderColor: "#86efac", backgroundColor: "#f0fdf4" } : {}) }}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", backgroundColor: "#FDFBF7", borderRadius: "10px", border: "1px solid #E8E0D4" }}>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: NAVY, fontFamily: "sans-serif" }}>Visible to nearby citizens</p>
            <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#8A7E6E", fontFamily: "sans-serif" }}>Allow others in your area to view and upvote this issue</p>
          </div>
          <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", flexShrink: 0, marginLeft: "16px" }}>
            <input type="checkbox" name="petition" checked={formData.petition} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: "absolute", inset: 0, borderRadius: "24px", cursor: "pointer", backgroundColor: formData.petition ? NAVY : "#D1C9B8", transition: "background 0.2s" }}>
              <span style={{ position: "absolute", top: "3px", left: formData.petition ? "23px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: formData.petition ? GOLD : "#fff", transition: "left 0.2s, background 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </span>
          </label>
        </div>

        <button type="submit"
          style={{ width: "100%", padding: "13px", borderRadius: "10px", border: "none", cursor: "pointer", backgroundColor: NAVY, color: "#fff", fontSize: "15px", fontWeight: "600", fontFamily: "sans-serif", letterSpacing: "0.03em" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1a2d4f"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = NAVY}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default SubmitReport;