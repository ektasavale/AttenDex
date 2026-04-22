import Reports from "./Reports";
import PrivacySettings from "./PrivacySettings";
import TodayReport from "./TodayReport";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import BASE_URL from "./api";

import { FaHome, FaUserPlus, FaClipboardCheck, FaChartBar, FaLock } from "react-icons/fa";


import { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";


import Webcam from "react-webcam";

const appStyle = {
  minHeight: "100vh",
  width:"100%",
  background: "linear-gradient(135deg, #1e1e2f, #2c3e50)",
  color: "white",
  fontFamily: "Segoe UI, sans-serif"
};

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
      width: "100%",
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

  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0
  });

  const [data, setData] = useState([]);
  useEffect(() => {
    
    fetch(`${BASE_URL}/api/stats/?className=${subject}`)
      .then(res => res.json())
     .then(data => {
  console.log("Stats API:", data);
  setStats(data);
})
      .catch(err => console.error(err));
  }, [subject]);
  useEffect(() => {
    //fetch(`${BASE_URL}/api/attendance-list/?className=${subject}`)
    fetch(`${BASE_URL}/api/attendance/today/?className=${subject}`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [subject]);

  const handleUnmark = async (rollNo) => {
    if (!confirm(`Unmark attendance for roll no ${rollNo}?`)) return;

    try {
      const res = await fetch(`${BASE_URL}/api/unmark-attendance/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, date: new Date().toISOString().split('T')[0] })
      });

      const data = await res.json();
      alert(data.message);

      // Refresh data
      fetch(`${BASE_URL}/api/stats/?className=${subject}`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
      fetch(`${BASE_URL}/api/attendance/today/?className=${subject}`)
        .then(res => res.json())
        .then(data => setData(data))
        .catch(err => console.error(err));
    } catch (error) {
      alert("Error unmarking attendance");
    }
  };
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      color: "white", fontFamily: "Segoe UI"
    }}>
      {/* Sidebar */}

      <div style={{ width: "200px", background: "rgba(0,0,0,0.4)", padding: "20px" }}>
        <h2>Attendex</h2>
        <p
          style={sidebarItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.lineHeight = "1.9";
            e.currentTarget.style.borderLeft = "4px solid #4f46e5";
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.75";
            e.currentTarget.style.lineHeight = "1.4";
            e.currentTarget.style.borderLeft = "none";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.paddingLeft = "14px";
          }}
          onClick={() => navigate("/")}
        >
          <FaHome /> Dashboard
        </p>

        <p
          style={sidebarItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.lineHeight = "1.9";
            e.currentTarget.style.borderLeft = "4px solid #4f46e5";
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.75";
            e.currentTarget.style.lineHeight = "1.4";
            e.currentTarget.style.borderLeft = "none";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.paddingLeft = "14px";
          }}
          onClick={() => navigate("/register")}
        >
          <FaUserPlus /> Register Student
        </p>

        <p
          style={sidebarItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.lineHeight = "1.9";
            e.currentTarget.style.borderLeft = "4px solid #4f46e5";
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.75";
            e.currentTarget.style.lineHeight = "1.4";
            e.currentTarget.style.borderLeft = "none";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.paddingLeft = "14px";
          }}
          onClick={() => navigate("/attendance")}
        >
          <FaClipboardCheck /> Mark Attendance
        </p>

        <p
          style={sidebarItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.lineHeight = "1.9";
            e.currentTarget.style.borderLeft = "4px solid #4f46e5";
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.75";
            e.currentTarget.style.lineHeight = "1.4";
            e.currentTarget.style.borderLeft = "none";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.paddingLeft = "14px";
          }}
          onClick={() => navigate("/reports")}
        >
          <FaChartBar /> Reports
        </p>

        <p
          style={sidebarItemStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.lineHeight = "2.9";
            e.currentTarget.style.borderLeft = "4px solid #4f46e5";
            e.currentTarget.style.background = "rgba(79,70,229,0.08)";
            e.currentTarget.style.paddingLeft = "18px";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.75";
            e.currentTarget.style.lineHeight = "1.4";
            e.currentTarget.style.borderLeft = "none";
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.paddingLeft = "14px";
          }}
          onClick={() => navigate("/settings/privacy")}
        >
          <FaLock /> Privacy Settings
        </p>
        {/*} <p onClick={() => navigate("/")}>
          <FaHome style={{ marginRight: "8px" }} /> Dashboard
        </p>
        <p onClick={() => navigate("/register")}>
          <FaUserPlus style={{ marginRight: "8px" }} /> Register Student
        </p>
        <p onClick={() => navigate("/attendance")}>
          <FaClipboardCheck style={{ marginRight: "8px" }} /> Mark Attendance
        </p>
        <p onClick={() => navigate("/reports")}>
          <FaChartBar style={{ marginRight: "8px" }} /> Reports
        </p>
        <p onClick={() => navigate("/settings/privacy")}>
          <FaLock style={{ marginRight: "8px" }} /> Privacy Settings
        </p>*/}
      </div>




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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* card content */}
            <StatCard title="👨‍🎓 Total Students" value={stats.total} /></motion.div>
          
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            ><StatCard title="✅ Present Today" value={stats.present} /></motion.div>
            
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              ><StatCard title="🚫 Absent Today" value={stats.absent} /></motion.div>

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
                    <th>Roll No</th><th>Name</th><th>Class</th><th>Department</th><th>Year</th><th>Time</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No attendance data
                      </td>
                    </tr>
                  ) : (
                    data.map((s, i) => (
                      <tr key={i}>
                        <td>{s.rollNo}</td>
                        <td>{s.name}</td>
                        <td>{subject}</td>
                        <td>{s.department}</td>
                        <td>{s.year}</td>
                        <td>{s.time}</td>
                        <td>
                          <span style={statusStyle(s.status)}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleUnmark(s.rollNo)} style={{ padding: "5px 10px", background: "red", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "0.8rem" }}>Unmark</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "20px" }}>
              <button style={buttonStyle} onClick={() => navigate("/register")}>➕ Register Student</button>
              <button style={buttonStyle} onClick={() => navigate("/attendance")}>✅ Mark Attendance</button>
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
        const [department, setDepartment] = useState("");
        const [year, setYear] = useState("");
  const handleRegister = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
          alert("⚠️ Camera not ready!");
        return;
    }

        try {
          console.log("Image:", imageSrc?.substring(0, 50));
        const res = await fetch(`${BASE_URL}/api/register/`, {
          method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({rollNo, name, className: className, department, year, faceImage: imageSrc })
      });

        const data = await res.json();

        if (res.ok) {
          alert("✅ Student registered successfully!");
        console.log("Success:", data);
      } else {
          alert("❌ " + (data.error || "Registration failed"));
        console.error("Error:", data);
      }

    } catch (error) {
          console.error("Network error:", error);
        alert("❌ Server error!");
    }
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
            <input
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
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

        // print report



        // Mark Attendance Page
        function MarkAttendance() {
  const webcamRef = useRef(null);

        const [className, setClassName] = useState("");
        const [lockedClass, setLockedClass] = useState("");
        const [result, setResult] = useState("");
        const [loading, setLoading] = useState(false);
        const [recent, setRecent] = useState([]);


  const handleAttendance = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
          alert("⚠️ Camera not ready!");
        return;
    }

        if (!className) {
          alert("⚠️ Enter class name");
        return;
    }

        try {
      const res = await fetch(`${BASE_URL}/api/attendance/`, {
          method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({
          className: className,
        faceImage: imageSrc
        })
      });

        const data = await res.json();

        setLoading(true);
        {const res= await fetch(`${BASE_URL}/api/attendance/`,);
        }
        setLoading(false);
        {loading ? "Scanning..." : "Scan Face & Mark"}
        if (res.ok) {
        if (data.status === "Already Marked") {
          setResult(`⚠️ ${data.name} already marked`);
        } else {
          setResult(`✅ ${data.name} marked ${data.status}`);
        }
        setRecent(prev => [data, ...prev.slice(0, 4)]);
      } else {
          setResult(`❌ ${data.error}`);
      }

    } catch (error) {
          console.error(error);
        setResult("❌ Server error");
    }
  };
        return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
          color: "white"
        }}>
          <h2>📸 Mark Attendance</h2>

          {/* BEFORE SESSION */}
          {!lockedClass ? (
            <>
              <input
                placeholder="Enter Class"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "8px",
                  border: "none"
                }}
              />

              <button
                onClick={() => setLockedClass(className)}
                style={{
                  padding: "12px 20px",
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                Start Attendance
              </button>
            </>
          ) : (
            /* AFTER SESSION START */
            <>
              <h3>Class: {lockedClass}</h3>

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user"
                }}
                style={{
                  width: "300px",
                  borderRadius: "10px",
                  margin: "20px 0"
                }}
              />

              <button
                onClick={handleAttendance}
                style={{
                  padding: "12px 20px",
                  background: "green",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                {loading ? "Scanning..." : "Scan Face & Mark"}
              </button>

              <button
                onClick={() => setLockedClass("")}
                style={{
                  padding: "10px 18px",
                  marginTop: "10px",
                  background: "crimson",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer"
                }}
              >
                End Session
              </button>
            </>
          )}

          {/* RESULT */}
          {result && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              borderRadius: "10px",
              background: result.includes("❌") ? "#e74c3c" : "#2ecc71",
              fontWeight: "bold"
            }}>
              {result}
            </div>
          )}

          {/* RECENT SCANS */}
          {recent.length > 0 && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              width: "300px"
            }}>
              <h4>Recent Scans</h4>
              {recent.map((s, i) => (
                <p key={i}>
                  {s.name} - {s.status}
                </p>
              ))}
            </div>
          )}
        </div>
        );

}

        // Stat Card
        function StatCard({title, value}) {
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
        const sidebarItemStyle = {
          padding: "12px 14px",
        margin: "8px 0",
        cursor: "pointer",
        borderRadius: "8px",
        lineHeight: "2.4",
        opacity: 0.85,
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        gap: "11px"
};

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
  if (status === "Present") return {background: "green", padding: "5px 10px", borderRadius: "5px" };
        if (status === "Absent") return {background: "red", padding: "5px 10px", borderRadius: "5px" };
        return {background: "orange", padding: "5px 10px", borderRadius: "5px" };
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

              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><TeacherDashboard /></motion.div>} />
                  <Route path="/register" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><RegisterStudent /></motion.div>} />
                  <Route path="/attendance" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><MarkAttendance /></motion.div>} />
                  <Route path="/reports" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><Reports /></motion.div>} />
                  <Route path="/settings/privacy" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><PrivacySettings onLogout={() => setLoggedIn(false)} /></motion.div>} />
                  <Route path="/today-reports" element={<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}><TodayReport /></motion.div>} />


                </Routes>

              </AnimatePresence>
            </Router>
          )}
        </>
        );
}

        export default App;
