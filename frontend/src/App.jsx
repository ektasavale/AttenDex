import Reports from "./Reports";
import PrivacySettings from "./PrivacySettings";
import TodayReport from "./TodayReport";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaUserPlus, FaClipboardCheck, FaChartBar, FaLock } from "react-icons/fa";

import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";

import Webcam from "react-webcam";
import BASE_URL from "./api";

/* ---------------- GLOBAL STYLE ---------------- */

const appStyle = {
  minHeight: "100vh",
  width: "100%",
  margin: 0,
  padding: 0,
  background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
  color: "white",
  fontFamily: "Segoe UI, sans-serif"
};

const glass = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(12px)",
  borderRadius: "15px",
  padding: "20px"
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0",
  borderRadius: "10px",
  border: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg, #28a745, #218838)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer"
};

/* ---------------- SPLASH ---------------- */

function Splash({ onFinish }) {
  useEffect(() => {
    const t = setTimeout(onFinish, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={appStyle}>
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", flexDirection: "column"
      }}>
        <h1 style={{ fontSize: "3rem" }}>ATTENDEX</h1>
        <p>Smart Attendance System</p>
      </div>
    </div>
  );
}

/* ---------------- LOGIN ---------------- */

function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  return (
    <div style={{ ...appStyle, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...glass, width: "300px" }}>
        <h2>Teacher Login 🎓</h2>
        <input placeholder="Username" onChange={e => setU(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" onChange={e => setP(e.target.value)} style={inputStyle} />
        <button style={buttonStyle} onClick={() => {
          if (u === "teacher" && p === "1234") onLogin(true);
          else alert("Invalid credentials");
        }}>Login</button>
      </div>
    </div>
  );
}

/* ---------------- SIDEBAR ---------------- */

const SidebarItem = ({ icon, text, onClick }) => (
  <p
    style={{
      padding: "12px",
      margin: "8px 0",
      cursor: "pointer",
      borderRadius: "8px",
      display: "flex",
      gap: "10px",
      opacity: 0.8,
      transition: "0.3s"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.opacity = "1";
      e.currentTarget.style.borderLeft = "4px solid #4f46e5";
      e.currentTarget.style.background = "rgba(79,70,229,0.1)";
      e.currentTarget.style.paddingLeft = "16px";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.opacity = "0.8";
      e.currentTarget.style.borderLeft = "none";
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.paddingLeft = "12px";
    }}
    onClick={onClick}
  >
    {icon} {text}
  </p>
);

/* ---------------- DASHBOARD ---------------- */

function Dashboard() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("Mathematics");
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });
  const [data, setData] = useState([]);

  const isMobile = window.innerWidth < 768;

  const load = () => {
    fetch(`${BASE_URL}/api/stats/?className=${subject}`)
      .then(r => r.json())
      .then(setStats);

    fetch(`${BASE_URL}/api/attendance/today/?className=${subject}`)
      .then(r => r.json())
      .then(setData);
  };

  useEffect(load, [subject]);

  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      minHeight: "100vh"
    }}>

      {/* SIDEBAR */}
      <div style={{
        width: isMobile ? "100%" : "220px",
        padding: "20px",
        background: "rgba(0,0,0,0.3)"
      }}>
        <h2>Attendex</h2>
        <SidebarItem icon={<FaHome />} text="Dashboard" onClick={() => navigate("/")} />
        <SidebarItem icon={<FaUserPlus />} text="Register" onClick={() => navigate("/register")} />
        <SidebarItem icon={<FaClipboardCheck />} text="Attendance" onClick={() => navigate("/attendance")} />
        <SidebarItem icon={<FaChartBar />} text="Reports" onClick={() => navigate("/reports")} />
        <SidebarItem icon={<FaLock />} text="Settings" onClick={() => navigate("/settings/privacy")} />
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>📊 {subject} Dashboard</h2>

        <select value={subject} onChange={e => setSubject(e.target.value)} style={inputStyle}>
          <option>Mathematics</option>
          <option>Science</option>
          <option>English</option>
        </select>

        {/* STATS */}
        <div style={{ display: "flex", gap: "20px", flexDirection: isMobile ? "column" : "row" }}>
          <StatCard title="👨‍🎓 Total" value={stats.total} />
          <StatCard title="✅ Present" value={stats.present} />
          <StatCard title="🚫 Absent" value={stats.absent} />
        </div>

        {/* TABLE */}
        <div style={{ ...glass, marginTop: "20px", overflowX: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr><th>Roll</th><th>Name</th><th>Status</th></tr>
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

        {/* QUICK ACTIONS */}
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <button style={buttonStyle} onClick={() => navigate("/register")}>➕ Register</button>
          <button style={buttonStyle} onClick={() => navigate("/attendance")}>✅ Mark Attendance</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- REGISTER ---------------- */

function Register() {
  const webcamRef = useRef(null);
  const [form, setForm] = useState({ rollNo:"", name:"", className:"", department:"", year:"" });

  const handle = async () => {
    const img = webcamRef.current.getScreenshot();

    await fetch(`${BASE_URL}/api/register/`, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ ...form, faceImage: img })
    });

    alert("Registered!");
    window.location.href="/";
  };

  return (
    <div style={{ ...appStyle, display:"flex", justifyContent:"center" }}>
      <div style={{ ...glass, width:"400px" }}>
        <h2>Register Student</h2>

        {Object.keys(form).map(k => (
          <input key={k} placeholder={k}
            onChange={e => setForm({...form, [k]:e.target.value})}
            style={inputStyle}
          />
        ))}

        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width:"100%" }} />

        <button style={buttonStyle} onClick={handle}>Scan Face & Save</button>
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
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ className, faceImage: img })
    });

    const data = await res.json();
    setResult(data.name + " marked");
  };

  return (
    <div style={{ ...appStyle, textAlign:"center" }}>
      <h2>📸 Mark Attendance</h2>
      <input value={className} onChange={e=>setClassName(e.target.value)} style={inputStyle}/>
      <Webcam ref={webcamRef} />
      <button style={buttonStyle} onClick={handle}>Scan Face & Mark</button>
      <p>{result}</p>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function StatCard({ title, value }) {
  return (
    <div style={{ ...glass, flex:1, textAlign:"center" }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* ---------------- APP ---------------- */

function App() {
  const [splash, setSplash] = useState(true);
  const [logged, setLogged] = useState(false);

  if (splash) return <Splash onFinish={()=>setSplash(false)} />;

  return !logged ? (
    <Login onLogin={setLogged} />
  ) : (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

/* ---------------- ROUTES ---------------- */

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings/privacy" element={<PrivacySettings />} />
        <Route path="/today-reports" element={<TodayReport />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;