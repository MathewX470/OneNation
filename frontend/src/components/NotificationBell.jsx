import { useState, useEffect, useRef } from "react";
import axios from "axios";

const POLL_INTERVAL = 15000;
const BASE = "http://localhost:5000";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen]                   = useState(false);
  const intervalRef                        = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get(`${BASE}/api/users/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data);
    } catch {
      // silently fail
    }
  };

  // Initial fetch + start polling
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const { data } = await axios.get(`${BASE}/api/users/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(data);
      } catch {
        // silently fail
      }
    };
    load();
    intervalRef.current = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  const markRead = async (id) => {
    const token = localStorage.getItem("token");
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    try {
      await axios.patch(`${BASE}/api/users/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n))
      );
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await axios.patch(`${BASE}/api/users/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      fetchNotifications();
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "1.5rem", position: "relative", padding: "4px"
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: 0, right: 0,
            background: "#C62828", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: "0.65rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "110%",
          width: 340, background: "#fff",
          borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          border: "1.5px solid #EBEBEB", zIndex: 999,
          maxHeight: 420, overflowY: "auto"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 18px 10px",
            borderBottom: "1px solid #F0F0F0",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <strong style={{ fontFamily: "Syne, sans-serif", fontSize: "0.9rem" }}>
              Notifications
            </strong>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: "0.75rem", color: "#C62828", fontWeight: 600
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <p style={{ padding: 20, textAlign: "center", color: "#AAA", fontSize: "0.85rem" }}>
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markRead(n._id)}
                style={{
                  padding: "12px 18px",
                  background: n.read ? "#fff" : "#FFF5F5",
                  borderBottom: "1px solid #F8F8F8",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1A1A1A" }}>
                  {n.title}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#666", marginTop: 3 }}>
                  {n.message}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#BBB", marginTop: 4 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}