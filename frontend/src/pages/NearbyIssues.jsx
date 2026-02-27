import { useState, useEffect } from "react";
import axios from "axios";

function NearbyIssues() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH NEARBY REPORTS =================
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        if (!navigator.geolocation) {
          alert("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const res = await axios.get(
              `http://localhost:5000/api/reports/nearby?lat=${lat}&lng=${lng}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // 🔥 Remove my own reports here (frontend level safety)
            const myUserId = JSON.parse(
              atob(token.split(".")[1])
            ).id;

            const filtered = res.data.reports.filter(
              (report) => report.userId !== myUserId
            );

            setReports(filtered);
            setLoading(false);
          },
          () => {
            alert("Location permission denied");
            setLoading(false);
          }
        );
      } catch (err) {
        console.error(err);
        alert("Failed to fetch nearby reports");
        setLoading(false);
      }
    };

    fetchNearby();
  }, []);

  // ================= UPVOTE =================
  const toggleUpvote = async (reportId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/reports/upvote/${reportId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId
            ? { ...report, upvotes: res.data.upvotes }
            : report
        )
      );

      if (selectedReport && selectedReport._id === reportId) {
        setSelectedReport({
          ...selectedReport,
          upvotes: res.data.upvotes,
        });
      }

    } catch (err) {
      console.error(err);
      alert("Upvote failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Nearby Issues
      </h1>

      {loading ? (
        <p>Loading nearby issues...</p>
      ) : reports.length === 0 ? (
        <p>No nearby issues found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white shadow rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedReport(report)}
            >
              {/* SUBJECT */}
              <h2 className="text-lg font-semibold mb-2">
                {report.subject}
              </h2>

              {/* SHORT DESCRIPTION */}
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {report.description}
              </p>

              <div className="flex justify-between items-center">

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    report.urgency === "High"
                      ? "bg-red-100 text-red-600"
                      : report.urgency === "Medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {report.urgency}
                </span>

                <span className="text-sm font-medium text-gray-600">
                  👍 {report.upvotes}
                </span>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">

            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              {selectedReport.subject}
            </h2>

            <p className="mb-6">
              {selectedReport.description}
            </p>

            <button
              onClick={() => toggleUpvote(selectedReport._id)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
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