import { useState, useEffect } from "react";
import axios from "axios";

const NAVY = "#0F1F3D";
const GOLD = "#B8972E";

const inputStyle = {
  width: "100%", border: "1px solid #D1C9B8", borderRadius: "8px",
  padding: "9px 13px", fontSize: "14px", backgroundColor: "#FDFBF7",
  color: NAVY, fontFamily: "sans-serif", outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "11px", fontWeight: "600", color: "#8A7E6E",
  textTransform: "uppercase", letterSpacing: "0.07em",
  fontFamily: "sans-serif", display: "block", marginBottom: "4px",
};

const sectionStyle = {
  backgroundColor: "#fff", borderRadius: "16px", padding: "28px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E8E0D4",
};

const statusConfig = {
  PENDING: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A", label: "Pending Review" },
  APPOINTMENT_SCHEDULED: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Appointment Scheduled" },
  VERIFIED: { bg: "#F0FDF4", color: "#166534", border: "#BBF7D0", label: "Verified Donor" },
  REJECTED: { bg: "#FEF2F2", color: "#B91C1C", border: "#FECACA", label: "Rejected" },
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [donorVerification, setDonorVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  // ── Fetch current donor status on mount ──────────────────
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`${API}/users/donor/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setDonorVerification(res.data.donorVerification);
        setLoading(false);
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

      {/* Header */}
      <div style={{ ...sectionStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: NAVY, fontFamily: "Georgia, serif", margin: 0 }}>
            Become a Donor
          </h1>
          <div style={{ width: "32px", height: "2px", backgroundColor: GOLD, borderRadius: "2px", marginTop: "8px" }} />
        </div>
        {editMode ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setEditMode(false)}
              style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #D1C9B8", backgroundColor: "#FDFBF7", color: "#6B5E4E", fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer" }}>
              Cancel
            </button>
            <button onClick={handleUpdate}
              style={{ padding: "9px 18px", borderRadius: "8px", border: "none", backgroundColor: "#166534", color: "#fff", fontSize: "13px", fontWeight: "600", fontFamily: "sans-serif", cursor: "pointer" }}>
              Save
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}
            style={{ padding: "9px 18px", borderRadius: "8px", border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: "#fff", fontSize: "13px", fontWeight: "600", fontFamily: "sans-serif", cursor: "pointer" }}>
            Edit Profile
          </button>
        )}
      </div>

      {/* Donor Verification Status */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "13px", fontWeight: "600", color: "#8A7E6E", textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "sans-serif", margin: "0 0 20px" }}>
          Donor Verification Status
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
};

export default ProfilePage;