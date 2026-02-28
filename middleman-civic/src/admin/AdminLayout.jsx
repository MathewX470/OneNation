import { Routes, Route, Navigate } from "react-router-dom";
import useMiddleManStore from "../store/commonStore";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

import AdminDashboard from "./AdminDashboard";
import ManageDepartmentAdmins from "./ManageDepartmentAdmins";
import ManageMiddlemen from "./ManageMiddlemen";
import ManageReports from "./ManageReports";
import SystemLogs from "./SystemLogs";
import GlobalAnnouncements from "./GlobalAnnouncements";
import ManageHospitals from "./ManageHospitals";

function AdminLayout() {
  const { role } = useMiddleManStore((state) => state);

  // 🔐 Protect super admin routes
  if (role !== "super_admin") {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="department-admins" element={<ManageDepartmentAdmins />} />
            <Route path="middlemen" element={<ManageMiddlemen />} />
            <Route path="reports" element={<ManageReports />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="announcements" element={<GlobalAnnouncements />} />
          <Route path="/hospitals" element={<ManageHospitals />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;