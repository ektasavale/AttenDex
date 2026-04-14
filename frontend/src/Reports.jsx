import { useEffect, useState } from "react";
import BASE_URL from "./api";

function Reports() {
  const [subject, setsubject] = useState("Mathematics");
  const [date, setDate] = useState("");
  const [report, setReport] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const fetchReport = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/attendance/?subject=${subject}&date=${date}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching report");
      setReport([]);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/stats/?subject=${subject}&date=${date}`
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setReport([]);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchStats();
  }, [subject, date]);

  const percentage = stats.total
    ? ((stats.present / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>📊 Reports</h2>

      {/* Filters */}
      <div style={{ margin: "20px 0" }}>
        <select
          value={subject}
          onChange={(e) => setsubject(e.target.value)}
        >
          <option>Mathematics</option>
          <option>Science</option>
          <option>English</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>👨‍🎓 Total: {stats.total}</div>
        <div>✅ Present: {stats.present}</div>
        <div>🚫 Absent: {stats.absent}</div>
        <div>📈 {percentage}% Attendance</div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", marginTop: "20px" }}>
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
                <td>{s.rollNo}</td>
                <td>{s.name}</td>
                <td>{s.status}</td>
                <td>{s.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;