import { useState } from "react";

function BecomeDonor() {
  const [status, setStatus] = useState("Not Registered");

  const [formData, setFormData] = useState({
    state: "",
    district: "",
    hospital: "",
    bloodGroup: "",
    healthDeclaration: false,
  });

  const bloodGroups = [
    "A+","A-","B+","B-","O+","O-","AB+","AB-"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.state ||
      !formData.district ||
      !formData.hospital ||
      !formData.bloodGroup ||
      !formData.healthDeclaration
    ) {
      alert("Please complete all required fields.");
      return;
    }

    setStatus("Pending Verification");
    alert("Verification request submitted successfully.");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Status Display */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">
          Donor Status
        </h2>

        <div
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            status === "Verified"
              ? "bg-green-100 text-green-700"
              : status === "Pending Verification"
              ? "bg-yellow-100 text-yellow-700"
              : status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </div>

        {status === "Verified" && (
          <p className="text-sm text-gray-500 mt-3">
            You are verified and eligible to be contacted by hospitals when blood is required.
          </p>
        )}
      </div>

      {/* Show form only if not verified */}
      {status !== "Verified" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-2xl p-8 space-y-6"
        >

          <h2 className="text-2xl font-bold">
            Blood Group Verification Request
          </h2>

          {/* Blood Group */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Blood Group *
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-2">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              placeholder="Enter your state"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium mb-2">
              District *
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              minLength={2}
              maxLength={50}
              placeholder="Enter your district"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Hospital *
            </label>
            <select
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">
                Hospital list will load from database
              </option>
            </select>
          </div>

          {/* Declaration */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="healthDeclaration"
              checked={formData.healthDeclaration}
              onChange={handleChange}
              required
            />
            <span className="text-sm">
              I confirm that the information provided is accurate and I agree to hospital verification.
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl font-semibold"
          >
            Submit Verification Request
          </button>

        </form>
      )}

    </div>
  );
}

export default BecomeDonor;