import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Dummy Lat/Long for selected report
  const latitude = 9.9312;
  const longitude = 76.2673;

  const position = [latitude, longitude];

  return (
    <div className="bg-[#F4F6F9] min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* OFFICIAL HEADER STRIP */}
        <div className="bg-[#0B3D91] text-white px-6 py-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Government Case File
              </h2>
              <p className="text-xs opacity-80">
                Department Administrative Review System
              </p>
            </div>
            <div className="text-sm font-medium">
              Case Ref No: GOV-{id}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white border border-gray-300">

          {/* CASE INFO SECTION */}
          <div className="grid md:grid-cols-3 border-b border-gray-300">

            {/* DETAILS */}
            <div className="col-span-2 p-6 border-r border-gray-300">
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Case Information
              </h3>

              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <p><span className="font-medium">Issue Title:</span> Pothole on MG Road</p>
                <p><span className="font-medium">Current Status:</span> Pending</p>
                <p><span className="font-medium">Location:</span> MG Road</p>
                <p><span className="font-medium">Date Reported:</span> 27 Feb 2026</p>
                <p><span className="font-medium">Submitted By:</span> Citizen Portal</p>
                <p><span className="font-medium">Priority Level:</span> Medium</p>
              </div>
            </div>

            {/* IMAGE */}
            <div className="p-6">
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Attached Evidence
              </h3>
              <img
                src="https://images.unsplash.com/photo-1597764699512-1e7f6c8e6d69"
                alt="issue"
                className="border border-gray-300"
              />
            </div>

          </div>

          {/* MAP SECTION */}
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Geographical Location Verification
            </h3>

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
                    Case Reference: GOV-{id} <br />
                    MG Road
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Latitude: {latitude} | Longitude: {longitude}
            </p>
          </div>

          {/* ASSIGNMENT SECTION */}
          <div className="p-6 border-b border-gray-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Department Assignment
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Assign Responsible Department
                </label>

                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-2 w-full border border-gray-400 px-4 py-2 focus:outline-none focus:border-[#0B3D91]"
                >
                  <option value="">Select Department</option>
                  <option>Public Works Department</option>
                  <option>Water Authority</option>
                  <option>Sanitation Department</option>
                  <option>Electricity Board</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTION PANEL */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-md font-semibold text-gray-700 mb-4">
              Administrative Action
            </h3>

            <div className="flex gap-4">
              <button className="bg-green-800 text-white px-6 py-2 text-sm hover:bg-green-900">
                Approve & Forward to Department
              </button>

              <button
                onClick={() => setShowDeclineModal(true)}
                className="bg-red-800 text-white px-6 py-2 text-sm hover:bg-red-900"
              >
                Reject Case
              </button>

              <button
                onClick={() => navigate("/")}
                className="border border-gray-400 px-6 py-2 text-sm"
              >
                Return to Dashboard
              </button>
            </div>
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
                  onClick={() => {
                    alert("Case Rejected Successfully");
                    setShowDeclineModal(false);
                  }}
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