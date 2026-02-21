import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Logic: Access Control ───
  useEffect(() => {
    if (isAuthenticated && user) {
      const target = user.role === "medical" ? "/medical/dashboard" : "/donor/dashboard";
      navigate(target);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await login(formData.email, formData.password);
    setSubmitting(false);
  };

  return (
    <div className="ll-login-viewport" style={styles.viewport}>
      {/* Brand Section (Hero) - Hidden on Mobile */}
      <div className="ll-login-hero" style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLogo}>🩸</div>
          <h1 style={styles.heroTitle}>LifeLink</h1>
          <p style={styles.heroTagline}>Precision Blood Logistics</p>
          <div style={styles.heroDivider} />
          <p style={styles.heroDesc}>
            Access the institutional network connecting life-saving donors with medical facilities across the region.
          </p>
          
          <div className="ll-hero-stats" style={styles.heroStats}>
            <div style={styles.heroStatItem}>
              <span style={styles.statVal}>24/7</span>
              <span style={styles.statLab}>Live Pulse</span>
            </div>
            <div style={styles.heroStatItem}>
              <span style={styles.statVal}>&lt;10km</span>
              <span style={styles.statLab}>Radius</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="ll-login-form-area" style={styles.formArea}>
        <div className="ll-login-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.mobileLogo}>🩸 LifeLink</div>
            <h2 style={styles.cardTitle}>Authentication</h2>
            <p style={styles.cardSubtitle}>Enter your credentials to access the console</p>
          </div>

          {error && (
            <div className="ll-error-toast" style={styles.errorToast}>
              <ShieldCheck size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.formStack}>
            <div style={styles.inputField}>
              <label style={styles.fieldLabel}>System Email</label>
              <div style={styles.inputBox}>
                <Mail size={18} style={styles.fieldIcon} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@institution.org"
                  required
                  style={styles.rawInput}
                />
              </div>
            </div>

            <div style={styles.inputField}>
              <label style={styles.fieldLabel}>Secure Password</label>
              <div style={styles.inputBox}>
                <Lock size={18} style={styles.fieldIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  style={styles.rawInput}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.visibilityBtn}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="ll-submit-btn"
              style={styles.submitBtn}
            >
              {submitting ? "AUTHORIZING..." : "ACCESS CONSOLE"}
            </button>
          </form>

          <div style={styles.footer}>
            <span>New to the network?</span>
            <Link to="/register" style={styles.registerLink}>Enroll Facility or Donor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  viewport: { display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#fff", overflow: "hidden" },
  
  hero: {
    flex: "1.2",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    color: "#fff"
  },
  heroContent: { maxWidth: "400px" },
  heroLogo: { fontSize: "48px", marginBottom: "20px" },
  heroTitle: { fontSize: "48px", fontWeight: "900", letterSpacing: "-0.04em", marginBottom: "4px" },
  heroTagline: { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.2em" },
  heroDivider: { width: "35px", height: "4px", background: "#be123c", margin: "25px 0" },
  heroDesc: { fontSize: "15px", color: "#94a3b8", lineHeight: "1.6", marginBottom: "40px" },
  heroStats: { display: "flex", gap: "40px" },
  heroStatItem: { display: "flex", flexDirection: "column" },
  statVal: { fontSize: "24px", fontWeight: "800" },
  statLab: { fontSize: "10px", color: "#64748b", fontWeight: "800", textTransform: "uppercase" },

  formArea: { flex: "1", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "20px" },
  card: { width: "100%", maxWidth: "440px", padding: "40px", backgroundColor: "#fff", borderRadius: "28px", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)" },
  cardHeader: { marginBottom: "35px", textAlign: "center" },
  mobileLogo: { display: "none", fontSize: "20px", fontWeight: "900", color: "#0f172a", marginBottom: "20px", letterSpacing: "-0.03em" },
  cardTitle: { fontSize: "28px", fontWeight: "900", color: "#0f172a", letterSpacing: "-0.03em" },
  cardSubtitle: { fontSize: "14px", color: "#64748b", marginTop: "6px" },

  errorToast: { display: "flex", alignItems: "center", gap: "12px", padding: "14px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "14px", fontSize: "13px", fontWeight: "700", border: "1px solid #fee2e2", marginBottom: "25px" },

  formStack: { display: "flex", flexDirection: "column", gap: "20px" },
  inputField: { display: "flex", flexDirection: "column", gap: "8px" },
  fieldLabel: { fontSize: "11px", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" },
  inputBox: { position: "relative", display: "flex", alignItems: "center" },
  fieldIcon: { position: "absolute", left: "16px", color: "#94a3b8" },
  rawInput: { width: "100%", padding: "16px 16px 16px 48px", fontSize: "15px", fontWeight: "600", border: "2px solid #f1f5f9", borderRadius: "14px", outline: "none", transition: "all 0.2s", backgroundColor: "#f8fafc", color: "#1e293b" },
  visibilityBtn: { position: "absolute", right: "12px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" },

  submitBtn: { width: "100%", padding: "18px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "16px", fontSize: "14px", fontWeight: "900", cursor: "pointer", transition: "all 0.2s", marginTop: "10px" },
  
  footer: { marginTop: "35px", textAlign: "center", fontSize: "14px", color: "#64748b" },
  registerLink: { color: "#be123c", fontWeight: "800", textDecoration: "none", marginLeft: "6px" }
};

const globalStyle = document.createElement("style");
globalStyle.textContent = `
  input:focus { border-color: #be123c !important; background-color: #fff !important; }
  .ll-submit-btn:hover { background-color: #1e293b; transform: translateY(-1px); }
  @media (max-width: 900px) {
    .ll-login-hero { display: none !important; }
    .ll-login-form-area { background-color: #0f172a !important; padding: 0 !important; }
    .ll-login-card { border-radius: 0 !important; max-width: 100% !important; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; border: none !important; }
    div[style*="display: none"] { display: block !important; }
  }
`;
document.head.appendChild(globalStyle);

export default Login;