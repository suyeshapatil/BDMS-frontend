import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminStatsChart({ stats }) {
  const data = [
    { name: 'Donors', value: stats.totalDonors },
    { name: 'Hospitals', value: stats.totalHospitals },
    { name: 'Verified', value: stats.verifiedHospitals },
    { name: 'Open Requests', value: stats.openBloodRequests },
    { name: 'Completed', value: stats.completedBloodRequests },
    { name: 'Donations', value: stats.totalDonationsRecorded },
  ];

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white">
        <h6 className="mb-0">System Overview</h6>
      </div>
      <div className="card-body" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#dc3545" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
