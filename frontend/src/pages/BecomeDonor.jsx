import React, { useEffect, useState } from "react";
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/users/profile", user, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) { alert(err.response?.data?.message || "Update failed"); }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "40px", color: NAVY, fontFamily: "sans-serif" }}>Loading...</div>;
  if (!user) return <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "sans-serif" }}>No profile found</div>;

  const dv = donorVerification;
  const dvStatus = dv ? (statusConfig[dv.status] || { bg: "#F9F9F9", color: "#555", border: "#E0E0E0", label: dv.status }) : null;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>

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

        {dv ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Status badge */}
            <div>
              <span style={{
                display: "inline-block", padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                backgroundColor: dvStatus.bg, color: dvStatus.color, border: `1px solid ${dvStatus.border}`,
                fontFamily: "sans-serif",
              }}>
                {dvStatus.label}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <p style={labelStyle}>Blood Group</p>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: NAVY, fontFamily: "sans-serif" }}>{dv.bloodGroup}</p>
              </div>

              {dv.hospital && (
                <>
                  <div>
                    <p style={labelStyle}>Hospital</p>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: NAVY, fontFamily: "sans-serif" }}>{dv.hospital.name}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Location</p>
                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: NAVY, fontFamily: "sans-serif" }}>{dv.hospital.district}, {dv.hospital.state}</p>
                  </div>
                </>
              )}

              {dv.appointmentDate && (
                <div>
                  <p style={labelStyle}>Appointment Date</p>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: "500", color: NAVY, fontFamily: "sans-serif" }}>
                    {new Date(dv.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {dv.rejectionReason && (
              <div style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "14px 16px" }}>
                <p style={{ ...labelStyle, color: "#B91C1C", marginBottom: "4px" }}>Rejection Reason</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#7F1D1D", fontFamily: "sans-serif" }}>{dv.rejectionReason}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 20px", color: "#8A7E6E", fontFamily: "sans-serif" }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🩸</p>
            <p style={{ fontSize: "14px", margin: 0 }}>You have not applied for donor verification yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;