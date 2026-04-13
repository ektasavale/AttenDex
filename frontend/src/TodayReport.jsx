import React, { useEffect, useState } from "react";
import axios from "axios";

function TodayReport() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/attendance/today/`
      );
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <h2>Today's Attendance Report</h2>

      <button
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Print Report
      </button>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, index) => (
            <tr key={index}>
              <td>{r.student_name}</td>
              <td>{r.rollNo}</td>
              <td>{r.status}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TodayReport;