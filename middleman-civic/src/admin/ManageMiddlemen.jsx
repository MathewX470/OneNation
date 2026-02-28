import { useEffect, useState } from "react";
import axios from "axios";
import useMiddleManStore from "../store/commonStore";

function ManageMiddlemen() {
  const { token } = useMiddleManStore((state) => state);

  const [middlemen, setMiddlemen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchMiddlemen = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/super-admin/middlemen`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMiddlemen(res.data.middlemen);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMiddlemen();
    }
  }, [token]);

  const handleCreate = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/super-admin/middlemen`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowModal(false);
      setFormData({ name: "", email: "", password: "" });
      fetchMiddlemen();
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/super-admin/middlemen/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMiddlemen();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Middlemen</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0B3D91] text-white px-4 py-2 rounded"
        >
          + Add Middleman
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {middlemen.map((mm) => (
              <tr key={mm._id} className="border-t">
                <td className="p-3">{mm.name}</td>
                <td className="p-3">{mm.email}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(mm._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Create Middleman
            </h3>

            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 mb-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 mb-3"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 mb-4"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-[#0B3D91] text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageMiddlemen;