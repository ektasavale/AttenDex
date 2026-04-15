import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📊 AttenDex</h2>
      </div>

      <div style={styles.content}>{children}</div>

      <div style={styles.bottomNav}>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/attendance">Attendance</Link>
        <Link to="/reports">Reports</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "15px",
    background: "#111",
    color: "white",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
  },
  bottomNav: {
    display: "flex",
    justifyContent: "space-around",
    padding: "12px",
    background: "#111",
    color: "white",
  },
};