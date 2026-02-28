import StatsCard from "./components/StatsCard";

function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard title="Total Reports" value="120" />
        <StatsCard title="Pending Reports" value="45" />
        <StatsCard title="Resolved Reports" value="75" />
        <StatsCard title="Department Admins" value="8" />
        <StatsCard title="Middlemen" value="14" />
        <StatsCard title="Citizens" value="340" />
      </div>
    </div>
  );
}

export default AdminDashboard;