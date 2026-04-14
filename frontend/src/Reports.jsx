import { useEffect, useState } from "react";
import BASE_URL from "./api";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Reports() {
  const [className, setClassName] = useState("Mathematics");
  const [report, setReport] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Attendance
  const fetchReport = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/attendance/today/?className=${className}`
    );

    if (!res.ok) throw new Error("Failed to fetch report");

    const data = await res.json();
    setReport(Array.isArray(data) ? data : []);
    return data; // ✅ ADD THIS
  } catch (err) {
    console.error(err);
    setError("Failed to load report");
    setReport([]);
    return []; // ✅ ADD THIS
  }
};
const fetchStats = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/stats/?className=${className}`
    );

    if (!res.ok) throw new Error("Failed to fetch stats");

    const data = await res.json();

    const formatted = {
      total: data.total || data.total_students || 0,
      present: data.present || data.present_count || 0,
      absent: data.absent || data.absent_count || 0,
    };

    setStats(formatted);
    return formatted; // ✅ ADD THIS
  } catch (err) {
    console.error(err);
    const fallback = { total: 0, present: 0, absent: 0 };
    setStats(fallback);
    return fallback; // ✅ ADD THIS
  }
};
  // Fetch Stats
 {/*} const fetchStats = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/stats/?className=${className}`
      );
      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      setStats({
        total: data.total || data.total_students || 0,
        present: data.present || data.present_count || 0,
        absent: data.absent || data.absent_count || 0,
      });
    } catch (err) {
      console.error(err);
      setStats({ total: 0, present: 0, absent: 0 });
    }
  };*/}
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.text(`Attendance Report - ${className}`, 14, 10);

  const tableData = report.map((s) => [
    s.rollNo,
    s.student_name,
    s.status,
    s.time,
  ]);

  autoTable(doc, {
    head: [["Roll No", "Name", "Status", "Time"]],
    body: tableData,
  });

  doc.save("attendance_report.pdf");
};
useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    await fetchReport();
    await fetchStats();
    setLoading(false);
  };

  loadData();
}, [className]);
  
  const percentage = stats.total
    ? ((stats.present / stats.total) * 100).toFixed(1)
    : 0;

  // Chart Data
  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Students",
        data: [stats.present, stats.absent],
      },
    ],
  };
console.log("Stats:", stats);
  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Reports Dashboard</h2>

      {/* Filters */}
      <div style={{ margin: "20px 0" }}>
        <select
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={{ padding: "10px", borderRadius: "8px" }}
        >
          <option>Mathematics</option>
          <option>Science</option>
          <option>English</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p>⏳ Loading data...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Stats Cards */}
      {!loading && (
        <>
          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <Card title="👨‍🎓 Total" value={stats.total} />
            <Card title="✅ Present" value={stats.present} />
            <Card title="🚫 Absent" value={stats.absent} />
            <Card title="📈 %" value={`${percentage}%`} />
          </div>

          {/* Chart */}
          <div
            style={{
              background: "rgba(23, 244, 19, 0.1)",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <Bar data={chartData} />
          </div>

          {/* Table */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              padding: "20px",
              borderRadius: "10px",
            }}
          ><button
  onClick={downloadPDF}
  style={{
    marginBottom: "15px",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
  }}
>
  📄 Download Report
</button><p>Report count: {report.length}</p>
            <table
  style={{
    width: "100%",
    color: "black",
    borderCollapse: "collapse",
    background: "white"
  }}
>
  <thead>
    <tr>
      <th style={{ border: "1px solid black", padding: "8px" }}>Roll No</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
      <th style={{ border: "1px solid black", padding: "8px" }}>Time</th>
    </tr>
  </thead>
  <tbody>
    {report.map((s, i) => (
      <tr key={i}>
        <td style={{ border: "1px solid black", padding: "8px" }}>{s.rollNo}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{s.student_name}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{s.status}</td>
        <td style={{ border: "1px solid black", padding: "8px" }}>{s.time}</td>
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </>
      )}
    </div>
  );
}

// Reusable Card
function Card({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: "white",
        color: "black",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        {value ?? 0}
      </p>
    </div>
  );
}

export default Reports;