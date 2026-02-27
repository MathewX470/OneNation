import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Requests from "./pages/Requests";
import Heatmap from "./pages/Heatmap";
<<<<<<< HEAD
import AdminRequests from "./pages-admin/AdminRequests";
import Login from "./pages/Login";

=======
import RequestDetails from "./pages/RequestDetails";
>>>>>>> 73f751f856bbd03c922cf749b77f2de59c481109
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Requests />} />
          <Route path="/heatmap" element={<Heatmap />} />
<<<<<<< HEAD
          <Route path="/admin" element={<AdminRequests />} />
          <Route path="/login" element={<Login />} />
=======
          <Route path="/request/:id" element={<RequestDetails />} />
>>>>>>> 73f751f856bbd03c922cf749b77f2de59c481109
        </Routes>
      </div>
    </Router>
  );
}

export default App;