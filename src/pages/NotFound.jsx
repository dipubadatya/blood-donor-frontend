import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>😕</div>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.text}>
          The page you are looking for does not exist or you do not have permission to access it.
        </p>
        <Link to="/" style={styles.button}>
          ← Go Back Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: "20px",
  },
  card: {
    textAlign: "center",
    maxWidth: "400px",
    padding: "48px 32px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  emoji: {
    fontSize: "72px",
    marginBottom: "16px",
  },
  title: {
    fontSize: "64px",
    fontWeight: "900",
    color: "#dc2626",
    lineHeight: "1",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "12px",
  },
  text: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "28px",
  },
  button: {
    display: "inline-block",
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#dc2626",
    borderRadius: "10px",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
};

export default NotFound;