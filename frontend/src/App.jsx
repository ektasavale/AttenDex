import Reports from "./Reports";
import PrivacySettings from "./PrivacySettings";
import { FaHome, FaUserPlus, FaClipboardCheck, FaChartBar, FaLock } from "react-icons/fa";


import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";


import Webcam from "react-webcam";


// Splash Screen


function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)"
    }}>
      <div style={{ textAlign: "center", color: "white" }}>
        <img src="/Stylish color palett.png" alt="logo" style={{ width: "200px", marginBottom: "20px" }} />
        <h1>Attendex</h1>
      </div>
    </div>
  );
}




// Login
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "teacher" && password === "1234") {
      onLogin(true);
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div style={{
      height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        padding: "40px", borderRadius: "15px", color: "white", width: "300px"
      }}>
        <h2>Teacher Login 🎓</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          <button style={buttonStyle}>Login</button>
        </form>
      </div>
    </div>
  );
}

// Dashboard
function TeacherDashboard() {
  const [subject, setSubject] = useState("Mathematics");
  const navigate = useNavigate();

  const stats = { students: 30, present: 28, absent: 2 };

  const data = [
    { id: "ST001", name: "Rahul", class: "Math 101", status: "Present" },
    { id: "ST002", name: "Sneha", class: "Math 101", status: "Absent" },
    { id: "ST003", name: "Amit", class: "Math 101", status: "Half Day" }
  ];

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      color: "white", fontFamily: "Segoe UI"
    }}>
      {/* Sidebar */}
      


  return (
    <div style={{ width: "200px", background: "rgba(0,0,0,0.4)", padding: "20px" }}>
      <h2>Attendex</h2>
      <p onClick={() => navigate("/")}>
        <FaHome style={{ marginRight: "8px" }} /> Dashboard
      </p>
      <p onClick={() => navigate("/register")}>
        <FaUserPlus style={{ marginRight: "8px" }} /> Register Student
      </p>
      <p onClick={() => navigate("/mark-attendance")}>
        <FaClipboardCheck style={{ marginRight: "8px" }} /> Mark Attendance
      </p>
      <p onClick={() => navigate("/reports")}>
        <FaChartBar style={{ marginRight: "8px" }} /> Reports
      </p>
      <p onClick={() => navigate("/settings/privacy")}>
        <FaLock style={{ marginRight: "8px" }} /> Privacy Settings
      </p>
    </div>
  );




      {/* Main */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>📊 {subject} Dashboard</h2>
        <p>Today: {new Date().toLocaleDateString()}</p>

        {/* Subject Selector */}
        <div style={{ margin: "20px 0" }}>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle}>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <StatCard title="👨‍🎓 Total Students" value={stats.students} />
          <StatCard title="✅ Present Today" value={stats.present} />
          <StatCard title="🚫 Absent Today" value={stats.absent} />
          <StatCard title="📚 Classes" value={6} />
        </div>

        {/* Notification */}
        <div style={{
          background: "rgba(255,255,255,0.1)", padding: "10px",
          borderRadius: "8px", marginBottom: "20px"
        }}>
          ⚠️ {stats.absent} students absent in {subject} today
        </div>

        {/* Attendance Table */}
        <div style={{
          background: "rgba(255,255,255,0.1)", padding: "20px",
          borderRadius: "10px", marginBottom: "20px"
        }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Roll No</th><th>Name</th><th>Class</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.05)" : "transparent" }}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.class}</td>
                  <td><span style={statusStyle(s.status)}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "20px" }}>
          <button style={buttonStyle} onClick={() => navigate("/register")}>➕ Register Student</button>
          <button style={buttonStyle} onClick={() => navigate("/mark-attendance")}>✅ Mark Attendance</button>
        </div>
      </div>
    </div>
  );
}

// Register Student Page
function RegisterStudent() {
  const webcamRef = useRef(null);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");

  const handleRegister = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, name, className, faceImage: imageSrc })
    });
    alert("Student registered successfully!");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      color: "white",
      fontFamily: "Segoe UI"
    }}>
      <div style={{
        padding: "30px",
        width: "400px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "15px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>➕ Register Student</h2>

        <input
          placeholder="Roll No"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Class"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          style={inputStyle}
        />

        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{
            width: "100%",
            borderRadius: "10px",
            margin: "20px 0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        />

        <button style={buttonStyle} onClick={handleRegister}>
          Scan Face & Save
        </button>
      </div>
    </div>
  );
}


// Mark Attendance Page
function MarkAttendance() {
  const webcamRef = useRef(null);
  const [rollNo, setRollNo] = useState("");
  const [className, setClassName] = useState("");

  const handleAttendance = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rollNo, className, faceImage: imageSrc })
    });
    alert("Attendance marked successfully!");
  };

  return (
    <div style={{ padding: "20px", color: "white", background:"radial-gradient(circle at center, #852020, #22124b, #946221)", minHeight: "100vh" }}>
      <h2>✅ Mark Attendance</h2>
      <input
        placeholder="Roll No"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Class"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        style={inputStyle}
      />
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: "300px", margin: "20px 0" }}
      />
      <button style={buttonStyle} onClick={handleAttendance}>
        Scan Face & Mark
      </button>
    </div>
  );
}
// Stat Card
function StatCard({ title, value }) {
  return (
    <div style={{
      flex: 1,
      background: "rgba(199, 191, 191, 0.1)",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

// Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "12px 0",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.75)",
  color: "black",
  fontSize: "1rem",
  outline: "none",
  backdropFilter: "blur(6px)",
  transition: "all 0.3s ease"
};



const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #28a745, #218838)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease"
};



const statusStyle = (status) => {
  if (status === "Present") return { background: "green", padding: "5px 10px", borderRadius: "5px" };
  if (status === "Absent") return { background: "red", padding: "5px 10px", borderRadius: "5px" };
  return { background: "orange", padding: "5px 10px", borderRadius: "5px" };
};

// App wrapper
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : !loggedIn ? (
        <Login onLogin={setLoggedIn} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/register" element={<RegisterStudent />} />
            <Route path="/mark-attendance" element={<MarkAttendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/privacy" element={<PrivacySettings onLogout={() => setLoggedIn(false)} />}/>

          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;