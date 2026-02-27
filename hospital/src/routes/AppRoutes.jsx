import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard";
//import Login from "../pages/login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}