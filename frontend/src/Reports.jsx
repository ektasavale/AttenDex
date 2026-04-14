import { useEffect, useState } from "react";
import BASE_URL from "./api";
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
      console.log(report);
      console.log(report.length);
      const data = await res.json();
      setReport(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load report");
      setReport([]);
    }
  };

  // Fetch Stats
  const fetchStats = async () => {
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
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchReport(), fetchStats()]).finally(() =>
      setLoading(false)
    );
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
              background: "rgba(255,255,255,0.1)",
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
          ><p>Report count: {report.length}</p>
            <table style={{ width: "100%" }}>
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
                      No data found
                    </td>
                  </tr>
                ) : (
                  report.map((s, i) => (
                    <tr key={i}>
                      <td>{s.rollNo || s.student?.rollNo || "-"}</td>
                      <td>{s.student_name || s.student?.student_name || "-"}</td>
                      <td>
                        <span
                          style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            background:
                              s.status === "Present"
                                ? "green"
                                : s.status === "Absent"
                                  ? "red"
                                  : "orange",
                          }}
                        >
                          {s.status || "-"}
                        </span>
                      </td>
                      <td>{s.time || s.timestamp || "-"}</td>
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

// Reusable Card
function Card({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.1)",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

export default Reports;