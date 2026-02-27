import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const hospitalToken = localStorage.getItem("hospitalToken");
  const donorToken = localStorage.getItem("donorToken");
  const adminToken = localStorage.getItem("adminToken");

  const token = hospitalToken || donorToken || adminToken;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;