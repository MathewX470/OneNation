import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import SubmitReport from "./pages/SubmitReport";
import BecomeDonor from "./pages/BecomeDonor";
import NearbyIssues from "./pages/NearbyIssues";
import ManageReports from "./pages/ManageReports";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout Wrapper */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="report" element={<SubmitReport />} />
          <Route path="donor" element={<BecomeDonor />} />
          <Route path="nearby" element={<NearbyIssues />} />
          <Route path="manage-reports" element={<ManageReports />} /> 
        </Route>

      </Routes>
    </Router>
  );
}

export default App;