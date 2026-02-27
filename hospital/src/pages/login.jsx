import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const { data } = await axios.post(
  "http://localhost:5000/api/hospital/login",
  { email: form.email, password: form.password }
);

      localStorage.setItem("hospitalToken", data.token);
      navigate("/dashboard");

    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Hospital Login</h2>

      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <br /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <br /><br />
        <button type="submit">Login</button>
      </form>

    </div>
  );
}
