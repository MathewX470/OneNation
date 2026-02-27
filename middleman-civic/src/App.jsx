import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Requests from "./pages/Requests";
import Heatmap from "./pages/Heatmap";
import AdminRequests from "./pages-admin/AdminRequests";
import Login from "./pages/Login";
import RequestDetails from "./pages/RequestDetails";
import Announcements from "./pages-admin/Announcements";
import Logs from "./pages/Logs";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Requests />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/admin" element={<AdminRequests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request/:id" element={<RequestDetails />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/request/:id" element={<RequestDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;