import { useEffect, useState } from "react";
import axios from "axios";
import useMiddleManStore from "../store/commonStore";

function SuperAdminReports() {
  const { token } = useMiddleManStore((state) => state);

  const [reports, setReports] = useState([]);
  const [middlemen, setMiddlemen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedMiddlemanId, setSelectedMiddlemanId] = useState("");

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/super-admin/reports`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReports(res.data.reports);
    } catch (error) {
      console.error("Fetch Reports Error:", error.response?.data || error.message);
    }
  };

  const fetchMiddlemen = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/super-admin/middlemen`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMiddlemen(res.data.middlemen || []);
    } catch (error) {
      console.error("Fetch Middlemen Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
      fetchMiddlemen();
    }
  }, [token]);

  const openModal = (report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setSelectedMiddlemanId(report.middleManID?._id || "");
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Update status
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/super-admin/reports/${selectedReport._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assign middleman if changed
      if (selectedMiddlemanId) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/super-admin/reports/${selectedReport._id}/assign`,
          { middleManID: selectedMiddlemanId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setShowModal(false);
      fetchReports();
    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      alert("Failed to update report");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report permanently?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/super-admin/reports/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === "High") return "bg-red-100 text-red-700";
    if (urgency === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusColor = (status) => {
    if (status === "Resolved") return "bg-green-100 text-green-700";
    if (status === "Closed") return "bg-gray-100 text-gray-700";
    if (status === "In Progress") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">User Reports</h2>
        <div className="text-sm text-gray-500">
          {reports.length} total reports
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-left">Urgency</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Middleman</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {new Date(report.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 font-medium">{report.subject}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(report.urgency)}`}>
                    {report.urgency}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="p-3">
                  {report.middleManID ? report.middleManID.name : "—"}
                </td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => openModal(report)}
                    className="text-[#0B3D91] hover:underline"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => handleDelete(report._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail + Manage Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Report Details</h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs text-gray-500">SUBJECT</p>
                <p className="font-medium">{selectedReport.subject}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">DESCRIPTION</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {selectedReport.photo && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">PHOTO</p>
                  <img
                    src={selectedReport.photo}
                    alt="Report"
                    className="max-h-64 rounded-lg border"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">URGENCY</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${getUrgencyColor(selectedReport.urgency)}`}>
                    {selectedReport.urgency}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">REPORTED BY</p>
                  <p>{selectedReport.userId?.name || "Unknown User"}</p>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">STATUS</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Assign Middleman */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">ASSIGN TO MIDDLEMAN</label>
                <select
                  value={selectedMiddlemanId}
                  onChange={(e) => setSelectedMiddlemanId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">— Unassigned —</option>
                  {middlemen.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-[#0B3D91] text-white rounded-lg hover:bg-[#0a2f70]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminReports;