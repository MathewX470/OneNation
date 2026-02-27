import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import commonStore from "../store/commonStore";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, staffId } = commonStore(state => state);

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Fetch report from backend
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/middleman/report/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequest(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, token]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!request)
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-700">Request Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 border border-gray-400"
        >
          Back to Dashboard
        </button>
      </div>
    );

  const position = [request.location.lat, request.location.lng];

  // Forward request
  const handleForward = async () => {
    if (!department) {
      alert("Please select a department before forwarding");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/middleman/forward-report",
        {
          reportId: request._id,
          adminDepartment: department,
          middleManID: staffId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        alert("Request has been forwarded to the department");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to forward request");
    }
  };

  // Decline request
  const handleDecline = async () => {
    if (!declineReason) {
      alert("Please enter a reason for rejection");
      return;
    }
    try {
      const res = await axios.put(
        "http://localhost:5000/api/middleman/decline-report",
        { requestId: id, reason: declineReason },
       
      );
      if (res.status === 200) {
        alert("Request has been declined");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to decline request");
    }
  };

  return (
    <div className="bg-[#F4F6F9] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="bg-[#0B3D91] text-white px-6 py-4 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Government Case File</h2>
            <p className="text-xs opacity-80">Department Administrative Review System</p>
          </div>
          <div className="text-sm font-medium">Case Ref No: GOV-{request._id}</div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white border border-gray-300">
          {/* CASE INFO */}
          <div className="grid md:grid-cols-3 border-b border-gray-300">
            <div className="col-span-2 p-6 border-r border-gray-300">
              <h3 className="text-md font-semibold text-gray-700 mb-4">Case Information</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <p><span className="font-medium">Issue Title:</span> {request.subject}</p>
                <p><span className="font-medium">Current Status:</span> {request.status}</p>
                <p><span className="font-medium">Urgency:</span> {request.urgency}</p>
                <p><span className="font-medium">Location:</span> {`Lat: ${request.location.lat}, Lng: ${request.location.lng}`}</p>
                <p><span className="font-medium">Upvotes:</span> {request.upvotes}</p>
                <p><span className="font-medium">Submitted By:</span> Citizen Portal</p>
                <p><span className="font-medium">Petition:</span> {request.petition ? "Yes" : "No"}</p>
                <p className="col-span-2"><span className="font-medium">Description:</span> {request.description}</p>
              </div>
            </div>

            {/* IMAGE */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-700 mb-4">Attached Evidence</h3>
              {request.photo ? (
                <img src={request.photo} alt="issue" className="border border-gray-300" />
              ) : (
                <div className="border border-gray-300 h-44 flex items-center justify-center text-gray-500">
                  No Image Provided
                </div>
              )}
            </div>
          </div>

          {/* MAP */}
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Geographical Location Verification</h3>
            <div className="border border-gray-400">
              <MapContainer
                center={position}
                zoom={14}
                style={{ height: "350px", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    Case Reference: GOV-{request._id} <br /> {request.subject}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* ASSIGNMENT */}
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Department Assignment</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Assign Responsible Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
                >
                  <option value="">Select Department</option>
                 
                  <option> electricity</option>
                  <option>road</option>
                  <option>environment</option>
                  <option>water</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTION PANEL */}
          <div className="p-6 bg-gray-50 flex gap-4">
            {request.status === "Open" && (
              <>
                <button
                  onClick={handleForward}
                  className="bg-green-800 text-white px-6 py-2 text-sm hover:bg-green-900"
                >
                  Approve & Forward to Department
                </button>
                <button
                  onClick={() => setShowDeclineModal(true)}
                  className="bg-red-800 text-white px-6 py-2 text-sm hover:bg-red-900"
                >
                  Reject Case
                </button>
              </>
            )}
            {request.status === "In Progress" && (
              <button className="bg-orange-800 text-white px-6 py-2 text-sm cursor-not-allowed">
                Already in progress
              </button>
            )}
            {request.status === "Resolved" && (
              <button className="bg-green-800 text-white px-6 py-2 text-sm cursor-not-allowed">
                Case resolved
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="border border-gray-400 px-6 py-2 text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* DECLINE MODAL */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10000">
          <div className="bg-white border border-gray-500 w-[500px]">
            <div className="bg-red-800 text-white px-6 py-3 text-sm font-semibold">
              Official Rejection Notice
            </div>
            <div className="p-6">
              <label className="text-sm font-medium text-gray-700">
                Reason for Rejection (Mandatory)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows="5"
                className="mt-2 w-full border border-gray-400 p-3 focus:outline-none focus:border-red-800"
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="border border-gray-400 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="bg-red-800 text-white px-4 py-2 text-sm hover:bg-red-900"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestDetails;