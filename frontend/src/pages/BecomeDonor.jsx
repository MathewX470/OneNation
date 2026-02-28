import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [donorVerification, setDonorVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
        setDonorVerification(res.data.donorVerification);
        setLoading(false);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <h2>Loading profile...</h2>;
  if (!user) return <h2>No profile found</h2>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>User Profile</h2>

      <div>
        <label>Full Name:</label>
        <input
          type="text"
          name="fullname"
          value={user.fullname || ""}
          disabled={!editMode}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email || ""}
          disabled={!editMode}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Phone:</label>
        <input
          type="text"
          name="phoneNo"
          value={user.phoneNo || ""}
          disabled={!editMode}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={user.pincode || ""}
          disabled={!editMode}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Aadhar:</label>
        <input
          type="text"
          name="aadhar"
          value={user.aadhar || ""}
          disabled={!editMode}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        {editMode ? (
          <>
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>Donor Verification Status</h3>

      {donorVerification ? (
        <div>
          <p><strong>Status:</strong> {donorVerification.status}</p>
          <p><strong>Blood Group:</strong> {donorVerification.bloodGroup}</p>

          {donorVerification.hospital && (
            <>
              <p><strong>Hospital:</strong> {donorVerification.hospital.name}</p>
              <p>
                <strong>Location:</strong>{" "}
                {donorVerification.hospital.district},{" "}
                {donorVerification.hospital.state}
              </p>
            </>
          )}

          {donorVerification.appointmentDate && (
            <p>
              <strong>Appointment:</strong>{" "}
              {new Date(
                donorVerification.appointmentDate
              ).toLocaleDateString()}
            </p>
          )}

          {donorVerification.rejectionReason && (
            <p style={{ color: "red" }}>
              <strong>Rejection Reason:</strong>{" "}
              {donorVerification.rejectionReason}
            </p>
          )}
        </div>
      ) : (
        <p>You have not applied for donor verification.</p>
      )}
    </div>
  );
};

export default ProfilePage;