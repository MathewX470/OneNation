import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("hospitalToken");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}