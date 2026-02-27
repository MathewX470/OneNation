import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [donor, setDonor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ───────────── Fetch Profile ─────────────
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${API}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data.user);
      setDonor(data.donorVerification);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // ───────────── Handle Change ─────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ───────────── Save Profile ─────────────
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const { data } = await axios.put(
        `${API}/users/profile`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data.user);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10">No user found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* User Info */}
      <div className="bg-white p-8 rounded-2xl shadow grid grid-cols-2 gap-6">

        <ProfileField
          label="Full Name"
          name="fullname"
          value={user.fullname}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Phone Number"
          name="phoneNo"
          value={user.phoneNo}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Email"
          name="email"
          value={user.email}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Pincode"
          name="pincode"
          value={user.pincode}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Latitude"
          name="lat"
          value={user.lat}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Longitude"
          name="lng"
          value={user.lng}
          editing={editing}
          onChange={handleChange}
        />

        <ProfileField
          label="Aadhar"
          name="aadhar"
          value={user.aadhar}
          editing={editing}
          onChange={handleChange}
        />

      </div>

      {/* Verified Donor Section */}
      {user.isVerifiedDonor && donor?.status === "VERIFIED" && (
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl shadow space-y-6">

          <h2 className="text-2xl font-bold text-red-600">
            🩸 Verified Blood Donor
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <DonorField label="Blood Group" value={donor.bloodGroup} />
            <DonorField label="Hospital" value={donor.hospital?.name} />
            <DonorField label="District" value={donor.hospital?.district} />
            <DonorField label="State" value={donor.hospital?.state} />
            <DonorField
              label="Verified On"
              value={new Date(donor.verifiedAt).toLocaleDateString()}
            />

          </div>
        </div>
      )}

    </div>
  );
}

// ───────────── Reusable Components ─────────────

function ProfileField({ label, name, value, editing, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      {editing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-lg font-medium mt-1">{value}</p>
      )}
    </div>
  );
}

function DonorField({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

export default ProfilePage;