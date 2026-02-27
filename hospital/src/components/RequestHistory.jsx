import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function RequestHistory() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("hospitalToken");

      const { data } = await axios.get("/hospital/requests", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(data);
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h3>Your Requests</h3>
      {requests.map((req) => (
        <div key={req._id}>
          {req.bloodGroup} | {req.unitsRequired} units | {req.status}
        </div>
      ))}
    </div>
  );
}