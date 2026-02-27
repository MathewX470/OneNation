import { useState } from "react";
import axios from "../api/axios";

export default function RequestForm() {
  const [form, setForm] = useState({
    bloodGroup: "A+",
    unitsRequired: "",
    urgencyLevel: "NORMAL"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("hospitalToken");
    console.log("TOKEN:", token);
    try {
      await axios.post(
      "http://localhost:5000/api/hospital/request",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      alert("Request created successfully");

    } catch {
      alert("Failed to create request");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Blood Request</h3>

      <select name="bloodGroup" onChange={handleChange}>
        <option>A+</option>
        <option>B+</option>
        <option>O+</option>
        <option>AB+</option>
      </select>

      <br /><br />

      <input
        name="unitsRequired"
        placeholder="Units Required"
        onChange={handleChange}
      />

      <br /><br />

      <select name="urgencyLevel" onChange={handleChange}>
        <option>NORMAL</option>
        <option>URGENT</option>
        <option>CRITICAL</option>
      </select>

      <br /><br />

      <button type="submit">Submit</button>
    </form>
  );
}