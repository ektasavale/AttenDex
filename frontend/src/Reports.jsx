import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { name: "Math", attendance: 85 },
  { name: "Science", attendance: 90 },
  { name: "English", attendance: 78 },
  { name: "History", attendance: 88 }
];

function Reports() {
  return (
    <div style={{
      padding: "30px",
      color: "white",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      minHeight: "100vh"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📊 Attendance Reports</h2>
      <div style={{
        background: "rgba(255,255,255,0.1)",
        borderRadius: "15px",
        padding: "20px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
      }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            <Bar dataKey="attendance" fill="#28a745" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Reports;