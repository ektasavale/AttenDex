import Reports from "./Reports";
import PrivacySettings from "./PrivacySettings";
import TodayReport from "./TodayReport";
import { motion } from "framer-motion";
import { FaHome, FaUserPlus, FaClipboardCheck, FaChartBar, FaLock } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Webcam from "react-webcam";
import BASE_URL from "./api";

/* ---------------- THEME ---------------- */
const appStyle = {
  minHeight: "100vh",
  background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
  color: "white",
  fontFamily: "Segoe UI, sans-serif"
};

const glassCard = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  padding: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "none"
};

const buttonStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#28a745",
  color: "white",
  cursor: "pointer",
  width: "100%"
};

/* ---------------- SPLASH ---------------- */
function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      color: "white"
    }}>
      <h1 style={{ fontSize: "3rem" }}>Attendex</h1>
      <p>Smart Attendance System</p>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */
function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const handle = (e) => {
    e.preventDefault();
    if (u === "teacher" && p === "1234") onLogin(true);
    else alert("Invalid credentials");
  };

  return (
    <div style={{ ...appStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handle} style={glassCard}>
        <h2>Teacher Login 🎓</h2>
        <input placeholder="Username" value={u} onChange={e => setU(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={p} onChange={e => setP(e.target.value)} style={inputStyle} />
        <button style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */
function Dashboard() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("Mathematics");
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [data, setData] = useState([]);

  const fetchStats = () => {
    fetch(`${BASE_URL}/api/stats/?className=${subject}`)
      .then(r => r.json())
      .then(setStats);
  };

  const fetchAttendance = () => {
    fetch(`${BASE_URL}/api/attendance/today/?className=${subject}`)
      .then(r => r.json())
      .then(setData);
  };

  useEffect(() => {
    fetchStats();
    fetchAttendance();
  }, [subject]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <div style={{ width: "220px", padding: "20px" }}>
        <h2>Attendex</h2>
        <p onClick={() => navigate("/")}> <FaHome /> Dashboard</p>
        <p onClick={() => navigate("/register")}> <FaUserPlus /> Register</p>
        <p onClick={() => navigate("/attendance")}> <FaClipboardCheck /> Attendance</p>
        <p onClick={() => navigate("/reports")}> <FaChartBar /> Reports</p>
        <p onClick={() => navigate("/settings/privacy")}> <FaLock /> Settings</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>📊 {subject} Dashboard</h2>
        <p>{new Date().toLocaleDateString()}</p>

        <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
          <option>Mathematics</option>
          <option>Science</option>
          <option>English</option>
        </select>

        <div style={{ display: "flex", gap: "20px" }}>
          <StatCard title="👨‍🎓 Total" value={stats.total} />
          <StatCard title="✅ Present" value={stats.present} />
          <StatCard title="🚫 Absent" value={stats.absent} />
        </div>

        <div style={{ ...glassCard, marginTop: "20px" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Roll</th><th>Name</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="3">No data</td></tr>
              ) : data.map((s, i) => (
                <tr key={i}>
                  <td>{s.rollNo}</td>
                  <td>{s.name}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REGISTER ---------------- */
function Register() {
  const webcamRef = useRef(null);
  const [form, setForm] = useState({
    rollNo: "", name: "", className: "", department: "", year: ""
  });

  const handle = async () => {
    const img = webcamRef.current.getScreenshot();

    const res = await fetch(`${BASE_URL}/api/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, faceImage: img })
    });

    if (res.ok) {
      alert("Registered!");
      window.location.href = "/";
    }
  };

  return (
    <div style={{ ...appStyle, display: "flex", justifyContent: "center" }}>
      <div style={{ ...glassCard, width: "400px" }}>
        <h2>Register Student</h2>

        {Object.keys(form).map((k) => (
          <input key={k} placeholder={k} value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            style={inputStyle}
          />
        ))}

        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: "100%" }} />

        <button style={buttonStyle} onClick={handle}>Register</button>
      </div>
    </div>
  );
}

/* ---------------- ATTENDANCE ---------------- */
function Attendance() {
  const webcamRef = useRef(null);
  const [className, setClassName] = useState("");
  const [result, setResult] = useState("");

  const handle = async () => {
    const img = webcamRef.current.getScreenshot();

    const res = await fetch(`${BASE_URL}/api/attendance/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ className, faceImage: img })
    });

    const data = await res.json();
    setResult(data.name + " marked");
  };

  return (
    <div style={{ ...appStyle, textAlign: "center" }}>
      <h2>Mark Attendance</h2>
      <input value={className} onChange={e => setClassName(e.target.value)} placeholder="Class" />
      <Webcam ref={webcamRef} />
      <button onClick={handle}>Mark</button>
      <p>{result}</p>
    </div>
  );
}

/* ---------------- CARD ---------------- */
function StatCard({ title, value }) {
  return (
    <div style={{ ...glassCard, flex: 1 }}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

/* ---------------- APP ---------------- */
function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [logged, setLogged] = useState(false);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      {!logged ? (
        <Login onLogin={setLogged} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/privacy" element={<PrivacySettings onLogout={() => setLogged(false)} />} />
            <Route path="/today-reports" element={<TodayReport />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;