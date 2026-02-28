import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);

  // 1. Fetch Logs from MongoDB via Backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get("http://localhost:5000/api/middleman/logs");
        setLogs(response.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // 2. Logic to filter logs based on the selected range
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.time);
    const today = new Date();
    const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

    if (filter === "today") return diffDays === 0;
    if (filter === "past5") return diffDays <= 5;
    if (filter === "past10") return diffDays <= 10;
    if (filter === "past30") return diffDays <= 30;
    return true;
  });

  // 3. Logic to generate Chart Data dynamically from the database results
  const getChartData = () => {
    const todayCount = logs.filter(l => Math.floor((new Date() - new Date(l.time)) / 86400000) === 0).length;
    const past5Count = logs.filter(l => Math.floor((new Date() - new Date(l.time)) / 86400000) <= 5).length;
    const past10Count = logs.filter(l => Math.floor((new Date() - new Date(l.time)) / 86400000) <= 10).length;
    const past30Count = logs.filter(l => Math.floor((new Date() - new Date(l.time)) / 86400000) <= 30).length;

    return [
      { range: "Today", count: todayCount },
      { range: "Past 5 Days", count: past5Count },
      { range: "Past 10 Days", count: past10Count },
      { range: "Past 30 Days", count: past30Count },
    ];
  };

  if (loading) return <div className="p-10 text-center">Loading logs...</div>;

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0B3D91]">Reports & Logs</h2>
          <p className="text-sm text-gray-600">Forwarded Complaints to Higher Authorities</p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="bg-white border border-gray-300 p-6 mb-8 shadow-sm">
          <label className="text-sm font-semibold text-gray-700 block mb-3">Filter Logs</label>
          <div className="flex gap-4">
            {["today", "past5", "past10", "past30"].map((range) => (
              <button
                key={range}
                onClick={() => setFilter(range)}
                className={`px-4 py-2 text-sm transition-colors border ${
                  filter === range ? "bg-[#0B3D91] text-white border-[#0B3D91]" : "border-gray-400 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range === "today" ? "Today" : `Past ${range.replace("past", "")} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* GRAPH SECTION */}
        <div className="bg-white border border-gray-300 p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Forwarded Reports Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <XAxis dataKey="range" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="count" fill="#0B3D91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LOG LIST */}
        <div className="bg-white border border-gray-300 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 uppercase tracking-wider text-xs">
            Detailed Logs ({filter})
          </h3>
          <div className="divide-y divide-gray-100">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div key={log._id} className="py-3 text-sm text-gray-700 hover:bg-gray-50 px-2 transition-colors">
                  <span className="font-medium text-gray-900">{log.reportTitle}</span>{" "}
                  <span className="text-gray-400">({log.reportId})</span>
                  <span className="mx-2">→</span>
                  <span className="text-blue-700 font-semibold">{log.forwardedTo}</span>{" "}
                  <span className="text-gray-500 block text-xs mt-1">
                    {new Date(log.time).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-4 italic">No logs found for this period.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Logs;