import { useState, useEffect, useMemo } from "react";
import axios from "axios";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";
const CREAM = "#F7F5F0";

function ManageReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/reports/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.reports);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch reports");
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.subject.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || report.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [reports, search, filter]);

  const statusConfig = {
    Open: { bg: "#FEF9EC", border: "#E8D48B", badge: "#92720A", label: "Open" },
    "In Progress": { bg: "#EFF6FF", border: "#BFDBFE", badge: "#1D4ED8", label: "In Progress" },
    Resolved: { bg: "#F0FDF4", border: "#BBF7D0", badge: "#15803D", label: "Resolved" },
  };

  const generateDisplayId = (mongoId) => `RPT-${mongoId.slice(-5).toUpperCase()}`;

  const inputStyle = {
    border: "1px solid #D1C9B8", borderRadius: "8px",
    padding: "9px 14px", fontSize: "13px",
    backgroundColor: "#fff", color: NAVY,
    fontFamily: "sans-serif", outline: "none",
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: 0 }}>
          Manage My Reports
        </h1>
        <div style={{ width: "40px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", margin: "10px auto 0" }} />
      </div>

      {/* Search + Filter */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by subject or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 2, minWidth: "200px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: "140px", cursor: "pointer" }}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#8A7E6E", fontFamily: "sans-serif" }}>Loading your reports...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredReports.map((report) => {
            const cfg = statusConfig[report.status] || { bg: "#F9F9F9", border: "#E0E0E0", badge: "#555" };
            return (
              <div
                key={report._id}
                onClick={() => setSelectedReport(report)}
                style={{
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  borderRadius: "14px", padding: "20px",
                  cursor: "pointer", transition: "all 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "none"; }}
              >
                <h2 style={{ fontSize: "15px", fontWeight: "600", color: NAVY, marginBottom: "8px", fontFamily: "sans-serif" }}>
                  {report.subject}
                </h2>
                <p style={{ fontSize: "13px", color: "#6B5E4E", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "sans-serif" }}>
                  {report.description}
                </p>
                <p style={{ fontSize: "11px", color: "#A0927E", marginBottom: "10px", fontFamily: "sans-serif" }}>
                  {generateDisplayId(report._id)}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "600", padding: "3px 10px",
                    borderRadius: "20px", backgroundColor: "#fff",
                    color: cfg.badge, border: `1px solid ${cfg.border}`,
                    fontFamily: "sans-serif",
                  }}>
                    {report.status}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6B5E4E", fontFamily: "sans-serif" }}>
                    👍 {report.upvotes}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#8A7E6E", padding: "40px", fontFamily: "sans-serif" }}>
              No reports found.
            </div>
          )}
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
            maxWidth: "520px", width: "100%", position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            border: "1px solid rgba(184,151,46,0.2)",
          }}>
            {/* Gold top bar */}
            <div style={{ position: "absolute", top: 0, left: "32px", right: "32px", height: "3px", backgroundColor: GOLD, borderRadius: "0 0 3px 3px" }} />

            <button
              onClick={() => setSelectedReport(null)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "none", border: "none", cursor: "pointer",
                color: "#8A7E6E", fontSize: "18px", lineHeight: 1,
              }}
            >✕</button>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: NAVY, marginBottom: "6px", fontFamily: "Georgia, serif", paddingRight: "24px" }}>
              {selectedReport.subject}
            </h2>
            <p style={{ fontSize: "11px", color: "#A0927E", marginBottom: "16px", fontFamily: "sans-serif" }}>
              {generateDisplayId(selectedReport._id)}
            </p>
            <p style={{ fontSize: "14px", color: "#3D3028", lineHeight: "1.6", marginBottom: "16px", fontFamily: "sans-serif" }}>
              {selectedReport.description}
            </p>

            {selectedReport.photo && (
              <img src={selectedReport.photo} alt="Report" style={{ borderRadius: "10px", marginBottom: "16px", width: "100%" }} />
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              {(() => {
                const cfg = statusConfig[selectedReport.status] || { bg: "#F9F9F9", badge: "#555", border: "#E0E0E0" };
                return (
                  <span style={{
                    fontSize: "12px", fontWeight: "600", padding: "4px 12px", borderRadius: "20px",
                    backgroundColor: cfg.bg, color: cfg.badge, border: `1px solid ${cfg.border}`,
                    fontFamily: "sans-serif",
                  }}>
                    {selectedReport.status}
                  </span>
                );
              })()}
              <span style={{ fontSize: "13px", fontWeight: "500", color: "#6B5E4E", fontFamily: "sans-serif" }}>
                👍 {selectedReport.upvotes}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageReports;