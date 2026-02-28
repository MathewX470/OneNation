import { useState, useEffect } from "react";
import axios from "axios";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

function NearbyIssues() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        if (!navigator.geolocation) { alert("Geolocation not supported"); return; }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const res = await axios.get(
              `http://localhost:5000/api/reports/nearby?lat=${lat}&lng=${lng}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const myUserId = JSON.parse(atob(token.split(".")[1])).id;
            const filtered = res.data.reports.filter((r) => r.userId !== myUserId);
            setReports(filtered);
            setLoading(false);
          },
          () => { alert("Location permission denied"); setLoading(false); }
        );
      } catch (err) {
        console.error(err);
        alert("Failed to fetch nearby reports");
        setLoading(false);
      }
    };
    fetchNearby();
  }, []);

  const toggleUpvote = async (reportId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/reports/upvote/${reportId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports((prev) => prev.map((r) => r._id === reportId ? { ...r, upvotes: res.data.upvotes } : r));
      if (selectedReport?._id === reportId) setSelectedReport({ ...selectedReport, upvotes: res.data.upvotes });
    } catch (err) { console.error(err); alert("Upvote failed"); }
  };

  const urgencyConfig = {
    High: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA" },
    Medium: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
    Low: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0" },
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: 0 }}>
          Nearby Issues
        </h1>
        <div style={{ width: "40px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", marginTop: "8px" }} />
        <p style={{ color: "#8A7E6E", fontSize: "13px", marginTop: "8px", fontFamily: "sans-serif" }}>
          Civic issues reported within your area
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#8A7E6E", fontFamily: "sans-serif" }}>Fetching nearby issues...</p>
      ) : reports.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          backgroundColor: "#fff", borderRadius: "16px",
          border: "1px solid #E8E0D4", color: "#8A7E6E", fontFamily: "sans-serif",
        }}>
          No nearby issues found in your area.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {reports.map((report) => {
            const urg = urgencyConfig[report.urgency] || urgencyConfig.Low;
            return (
              <div
                key={report._id}
                onClick={() => setSelectedReport(report)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E8E0D4",
                  borderRadius: "14px", padding: "20px",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#E8E0D4"; e.currentTarget.style.transform = "none"; }}
              >
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: NAVY, marginBottom: "8px", fontFamily: "sans-serif" }}>
                  {report.subject}
                </h2>
                <p style={{
                  fontSize: "13px", color: "#6B5E4E", marginBottom: "14px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden", fontFamily: "sans-serif", lineHeight: "1.5",
                }}>
                  {report.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px",
                    backgroundColor: urg.bg, color: urg.color, border: `1px solid ${urg.border}`,
                    fontFamily: "sans-serif",
                  }}>
                    {report.urgency}
                  </span>
                  <span style={{ fontSize: "12px", color: "#8A7E6E", fontFamily: "sans-serif" }}>
                    👍 {report.upvotes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedReport && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,31,61,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px",
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "18px", padding: "32px",
            maxWidth: "500px", width: "100%", position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            border: "1px solid rgba(184,151,46,0.2)",
          }}>
            <div style={{ position: "absolute", top: 0, left: "32px", right: "32px", height: "3px", backgroundColor: GOLD, borderRadius: "0 0 3px 3px" }} />

            <button
              onClick={() => setSelectedReport(null)}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: "#8A7E6E", fontSize: "18px" }}
            >✕</button>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: NAVY, marginBottom: "12px", fontFamily: "Georgia, serif", paddingRight: "24px" }}>
              {selectedReport.subject}
            </h2>
            <p style={{ fontSize: "14px", color: "#3D3028", lineHeight: "1.7", marginBottom: "24px", fontFamily: "sans-serif" }}>
              {selectedReport.description}
            </p>

            <button
              onClick={() => toggleUpvote(selectedReport._id)}
              style={{
                width: "100%", padding: "11px", borderRadius: "10px", border: "none",
                cursor: "pointer", backgroundColor: NAVY, color: "#fff",
                fontSize: "14px", fontWeight: "600", fontFamily: "sans-serif",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1a2d4f"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = NAVY}
            >
              👍 Upvote ({selectedReport.upvotes})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyIssues;