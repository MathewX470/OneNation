import { useState } from "react";

function NearbyIssues() {
  const [reports, setReports] = useState([
    {
      id: "RPT-001",
      title: "Broken Streetlight - MG Road",
      description: "The streetlight near the bus stop has not been working for 3 days.",
      urgency: "High",
      upvotes: 12,
      userUpvoted: false,
    },
    {
      id: "RPT-002",
      title: "Pothole - Kaloor Junction",
      description: "Large pothole causing traffic issues during peak hours.",
      urgency: "Medium",
      upvotes: 8,
      userUpvoted: false,
    },
    {
      id: "RPT-003",
      title: "Garbage Overflow - Market Area",
      description: "Garbage bins overflowing creating hygiene concerns.",
      urgency: "Low",
      upvotes: 5,
      userUpvoted: false,
    },
  ]);

  const [selectedReport, setSelectedReport] = useState(null);

  const toggleUpvote = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) => {
        if (report.id === reportId) {
          return {
            ...report,
            upvotes: report.userUpvoted
              ? report.upvotes - 1
              : report.upvotes + 1,
            userUpvoted: !report.userUpvoted,
          };
        }
        return report;
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Nearby Issues
      </h1>

      {/* CARD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white shadow rounded-2xl p-6 cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedReport(report)}
          >
            <h2 className="text-lg font-semibold mb-2">
              {report.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              ID: {report.id}
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
              {selectedReport.title}
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              ID: {selectedReport.id}
            </p>

            <p className="mb-6">
              {selectedReport.description}
            </p>

            <button
              onClick={() => toggleUpvote(selectedReport.id)}
              className={`w-full py-2 rounded-xl font-medium transition ${
                selectedReport.userUpvoted
                  ? "bg-gray-200 text-gray-800"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {selectedReport.userUpvoted ? "Remove Upvote" : "Upvote"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default NearbyIssues;