import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy logs aligned with schema
const dummyLogs = [
  {
    id: 1,
    reportId: "REQ-101",
    reportTitle: "Pothole complaint forwarded",
    forwardedTo: "Municipal Engineering Dept",
    time: "2026-02-27T09:15:00",
  },
  {
    id: 2,
    reportId: "REQ-102",
    reportTitle: "Water leakage report forwarded",
    forwardedTo: "Water Authority",
    time: "2026-02-25T11:00:00",
  },
  {
    id: 3,
    reportId: "REQ-103",
    reportTitle: "Garbage issue forwarded",
    forwardedTo: "Sanitation Dept",
    time: "2026-02-20T14:30:00",
  },
  {
    id: 4,
    reportId: "REQ-104",
    reportTitle: "Streetlight issue forwarded",
    forwardedTo: "Electricity Board",
    time: "2026-02-10T18:00:00",
  },
  {
    id: 5,
    reportId: "REQ-105",
    reportTitle: "Drainage complaint forwarded",
    forwardedTo: "Public Works Dept",
    time: "2026-01-30T10:00:00",
  },
];

// Chart summary data
const chartData = [
  { range: "Today", count: 1 },
  { range: "Past 5 Days", count: 1 },
  { range: "Past 10 Days", count: 1 },
  { range: "Past 30 Days", count: 3 },
];

function Logs() {
  const [filter, setFilter] = useState("today");

  const today = new Date("2026-02-27"); // replace with new Date() in real app
  const logs = dummyLogs.filter((log) => {
    const logDate = new Date(log.time);
    const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));

    if (filter === "today") return diffDays === 0;
    if (filter === "past5") return diffDays <= 5;
    if (filter === "past10") return diffDays <= 10;
    if (filter === "past30") return diffDays <= 30;
    return true;
  });

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#0B3D91]">
            Reports & Logs
          </h2>
          <p className="text-sm text-gray-600">
            Forwarded Complaints to Higher Authorities
          </p>
        </div>

        {/* FILTER BUTTONS */}
        <div className="bg-white border border-gray-300 p-6 mb-8">
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Filter Logs
          </label>
          <div className="flex gap-4">
            {["today", "past5", "past10", "past30"].map((range) => (
              <button
                key={range}
                onClick={() => setFilter(range)}
                className={`px-4 py-2 text-sm border ${
                  filter === range
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-400"
                }`}
              >
                {range === "today"
                  ? "Today"
                  : range === "past5"
                  ? "Past 5 Days"
                  : range === "past10"
                  ? "Past 10 Days"
                  : "Past 30 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* GRAPH SECTION */}
        <div className="bg-white border border-gray-300 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Forwarded Reports Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0B3D91" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LOG LIST */}
        <div className="bg-white border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {filter === "today"
              ? "Today"
              : filter === "past5"
              ? "Past 5 Days"
              : filter === "past10"
              ? "Past 10 Days"
              : "Past 30 Days"} Logs
          </h3>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="text-sm text-gray-700">
                • <span className="font-semibold">{log.reportTitle}</span>{" "}
                → <span className="text-blue-700">{log.forwardedTo}</span>{" "}
                <span className="text-gray-500">({new Date(log.time).toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Logs;
