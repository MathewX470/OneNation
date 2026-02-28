import { useEffect, useState } from "react";
import axios from "axios";
import useMiddleManStore from "../store/commonStore";

const ManageHospitals = () => {
  const { token } = useMiddleManStore((state) => state);

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/super-admin/hospitals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHospitals(res.data.hospitals || []);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      setError("Failed to fetch hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHospitals();
    }
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/super-admin/hospitals`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Hospital account created successfully.");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", phone: "" });
      fetchHospitals();
    } catch (err) {
      console.error("Create Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create hospital.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/super-admin/hospitals/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHospitals((prev) => prev.filter((h) => h._id !== id));
      setDeleteTarget(null);
      setSuccess("Hospital deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err.response?.data || err.message);
      setError("Failed to delete hospital.");
    }
  };

  const handleToggleVerify = async (id, current) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/super-admin/hospitals/${id}/verify`,
        { isVerified: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHospitals((prev) =>
        prev.map((h) => (h._id === id ? { ...h, isVerified: !current } : h))
      );
    } catch (err) {
      console.error("Verify Error:", err.response?.data || err.message);
      setError("Failed to update verification status.");
    }
  };

  const filtered = hospitals.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Hospitals</h2>
        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowModal(true);
          }}
          className="bg-[#0B3D91] text-white px-4 py-2 rounded"
        >
          + Add Hospital
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex justify-between">
          {success}
          <button onClick={() => setSuccess("")} className="font-bold">×</button>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex justify-between">
          {error}
          <button onClick={() => setError("")} className="font-bold">×</button>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, district..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full sm:max-w-xs text-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-gray-800">{hospitals.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {hospitals.filter((h) => h.isVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Unverified</p>
          <p className="text-2xl font-bold text-yellow-500">
            {hospitals.filter((h) => !h.isVerified).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            Loading hospitals...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            No hospitals found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hospital, idx) => (
                <tr key={hospital._id} className="border-t">
                  <td className="p-3 text-gray-400">{idx + 1}</td>
                  <td className="p-3 font-medium">{hospital.name}</td>
                  <td className="p-3">{hospital.email}</td>
                  <td className="p-3">{hospital.phone || "—"}</td>
                  <td className="p-3">
                    {hospital.district && hospital.state
                      ? `${hospital.district}, ${hospital.state}`
                      : hospital.district || hospital.state || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        hospital.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {hospital.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleToggleVerify(hospital._id, hospital.isVerified)
                        }
                        className={`text-xs font-medium ${
                          hospital.isVerified
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {hospital.isVerified ? "Revoke" : "Verify"}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(hospital)}
                        className="text-red-600 text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Hospital Account</h3>

            {error && (
              <div className="mb-3 rounded bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Hospital Name *"
                className="border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email *"
                className="border p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password *"
                className="border p-2 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="border p-2 rounded"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={formLoading}
                className="px-4 py-2 bg-[#0B3D91] text-white rounded disabled:opacity-60"
              >
                {formLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-base font-bold mb-2">Delete Hospital?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHospitals;
