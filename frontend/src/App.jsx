function App() {
  const styles = {
    body: {
      margin: 0,
      padding: 0,
      background: "radial-gradient(circle at center, #852020, #22124b, #946221)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
      fontFamily: "'Segoe UI', sans-serif",
      borderRadius: "10px",
      boxSizing: "border-box",
    },
    logoContainer: {
      textAlign: "center",
      color: "white",
      animation: "fadeIn 2s ease-in-out",
      padding: "1rem",
      maxWidth: "90%", // prevents overflow on small screens
    },
    logoImage: {
      width: "clamp(150px, 40vw, 300px)", // responsive image size
      height: "auto",
      marginBottom: "20px",
      borderRadius: "10px",
      animation: "bounce 2s infinite",
    },
    logoTitle: {
      fontSize: "clamp(2rem, 8vw, 6rem)", // scales text between mobile and desktop
      fontWeight: 600,
      letterSpacing: "1px",
      animation: "slideUp 2s ease-in-out",
      wordBreak: "break-word", // avoids overflow
    },
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      <div style={styles.body}>
        <div style={styles.logoContainer}>
          <img
            src="/Stylish color palett.png"
            alt="Attendex Logo"
            style={styles.logoImage}
          />
          <h1 style={styles.logoTitle}>Attendex</h1>
        </div>
      </div>
    </>
  );
}

export default App;