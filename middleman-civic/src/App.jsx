import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Requests from "./pages/Requests";
import Heatmap from "./pages/Heatmap";
import RequestDetails from "./pages/RequestDetails";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Requests />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/request/:id" element={<RequestDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;