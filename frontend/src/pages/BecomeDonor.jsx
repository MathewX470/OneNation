import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function BecomeDonor() {
  const token = localStorage.getItem("token"); // or use your auth context

  const [status, setStatus] = useState("Not Registered");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    state: "",
    district: "",
    hospital: "",
    bloodGroup: "",
    healthDeclaration: false,
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // ── Fetch current donor status on mount ──────────────────
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${API}/users/donor/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch donor status:", err);
      }
    };

    if (token) fetchStatus();
  }, [token]);

  // ── Fetch hospitals when state + district are filled ─────
  useEffect(() => {
    const fetchHospitals = async () => {
      if (formData.state.length < 2 || formData.district.length < 2) {
        setHospitals([]);
        return;
      }

      setLoadingHospitals(true);
      try {
        const { data } = await axios.get(`${API}/users/hospitals`, {
          params: { state: formData.state, district: formData.district },
          headers: { Authorization: `Bearer ${token}` },
        });
        setHospitals(data.hospitals);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
        setHospitals([]);
      } finally {
        setLoadingHospitals(false);
      }
    };

    // Debounce so it doesn't fire on every keystroke
    const timer = setTimeout(fetchHospitals, 600);
    return () => clearTimeout(timer);
  }, [formData.state, formData.district, token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset hospital selection when location changes
      ...(name === "state" || name === "district" ? { hospital: "" } : {}),
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.state ||
      !formData.district ||
      !formData.hospital ||
      !formData.bloodGroup ||
      !formData.healthDeclaration
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${API}/users/donor/verify`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(data.status);
      alert(data.message);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Status Display */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-3">Donor Status</h2>
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
            You are verified and eligible to be contacted by hospitals when
            blood is required.
          </p>
        )}
        {status === "Rejected" && (
          <p className="text-sm text-gray-500 mt-3">
            Your request was rejected. You may submit a new request below.
          </p>
        )}
      </div>

      {/* Show form only if not verified or pending */}
      {status !== "Verified" && status !== "Pending Verification" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold">
            Blood Group Verification Request
          </h2>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

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
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-2">State *</label>
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
              disabled={loadingHospitals || hospitals.length === 0}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">
                {loadingHospitals
                  ? "Loading hospitals..."
                  : hospitals.length === 0
                  ? "Enter state & district to load hospitals"
                  : "Select a hospital"}
              </option>
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} — {h.address || h.district}
                </option>
              ))}
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
              className="mt-0.5"
            />
            <span className="text-sm">
              I confirm that the information provided is accurate and I agree to
              hospital verification.
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Verification Request"}
          </button>
        </form>
      )}
    </div>
  );
}

export default BecomeDonor;