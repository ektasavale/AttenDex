import { useState } from "react";

function PrivacySettings({ onLogout }) {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [dataStorage, setDataStorage] = useState(true);

  return (
    <div style={{
      padding: "40px",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      color: "white",
      fontFamily: "Segoe UI"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>⚙️ Settings</h2>

      {/* Privacy Section */}
      <div style={sectionStyle}>
        <h3>🔒 Privacy Controls</h3>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={cameraEnabled}
            onChange={() => setCameraEnabled(!cameraEnabled)}
          />
          Enable Camera Access
        </label>
        <label style={labelStyle}>
          <input
            type="checkbox"
            checked={dataStorage}
            onChange={() => setDataStorage(!dataStorage)}
          />
          Allow Secure Data Storage
        </label>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          Your data is stored securely and never shared outside Attendex.
        </p>
      </div>

      {/* Account Section */}
      <div style={sectionStyle}>
        <h3>👤 Account</h3>
        <p>Logged in as: <strong>Teacher</strong></p>
        <button style={logoutButtonStyle} onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

const sectionStyle = {
  background: "rgba(255,255,255,0.1)",
  borderRadius: "15px",
  padding: "20px",
  marginBottom: "25px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 6px 15px rgba(0,0,0,0.3)"
};

const labelStyle = {
  display: "block",
  margin: "10px 0",
  fontSize: "1rem"
};

const logoutButtonStyle = {
  padding: "12px 20px",
  background: "linear-gradient(135deg, #dc3545, #a71d2a)",
  color: "white",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
};

export default PrivacySettings;