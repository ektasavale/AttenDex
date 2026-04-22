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
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch Report
  const fetchReport = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/attendance/today/?className=${className}`);
      const data = await res.json();
      setReport(Array.isArray(data) ? data : []);
    } catch {
      setReport([]);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/stats/?className=${className}`);
      const data = await res.json();

      setStats({
        total: data.total || 0,
        present: data.present || 0,
        absent: data.absent || 0,
      });
    } catch {
      setStats({ total: 0, present: 0, absent: 0 });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchReport();
      await fetchStats();
      setLoading(false);
    };
    load();
  }, [className]);

  // PDF Download
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
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Reports Dashboard</h2>

      {/* Filter */}
      <select
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        style={styles.select}
      >
        <option>Mathematics</option>
        <option>Science</option>
        <option>English</option>
      </select>

      {loading ? (
        <p style={{ marginTop: "20px" }}>⏳ Loading...</p>
      ) : (
        <>
          {/* Stats */}
          <div style={styles.cardContainer}>
            <Card title="👨‍🎓 Total" value={stats.total} />
            <Card title="✅ Present" value={stats.present} />
            <Card title="🚫 Absent" value={stats.absent} />
            <Card title="📈 %" value={`${percentage}%`} />
          </div>

          {/* Chart (SMALL SIZE FIXED) */}
          <div style={styles.chartBox}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>

          {/* Table */}
          <div style={styles.tableBox}>
            <button style={styles.downloadBtn} onClick={downloadPDF}>
              📄 Download Report
            </button>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {report.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  report.map((s, i) => (
                    <tr key={i}>
                      <td>{s.rollNo}</td>
                      <td>{s.student_name}</td>
                      <td>{s.status}</td>
                      <td>{s.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// Card
function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={{ opacity: 0.7 }}>{title}</p>
      <h2>{value ?? 0}</h2>
    </div>
  );
}

// 🎨 CLEAN STYLES
const styles = {
  container: {
    padding: "20px",
    color: "white",
    background: "#0f172a",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "20px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  card: {
    flex: 1,
    padding: "20px",
    borderRadius: "12px",
    background: "#1e293b",
    textAlign: "center",
  },
  chartBox: {
    height: "250px", // ✅ SMALLER CHART
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  tableBox: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  downloadBtn: {
    padding: "10px 15px",
    background: "#6366f1",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    marginBottom: "10px",
  },
};

export default Reports;