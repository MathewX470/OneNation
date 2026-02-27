import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Requests from "./pages/Requests";
import Heatmap from "./pages/Heatmap";
import AdminRequests from "./pages-admin/AdminRequests";
import Login from "./pages/Login";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;