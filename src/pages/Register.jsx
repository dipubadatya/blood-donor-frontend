import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, Zap, MapPin, User, Mail, Phone, Lock } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "donor",
    bloodGroup: "",
    longitude: "",
    latitude: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      const target = user.role === "medical" ? "/medical/dashboard" : "/donor/dashboard";
      navigate(target);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("❌ GPS not supported.");
      return;
    }
    setGeoLoading(true);
    setGeoStatus("📡 Locating satellites...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setGeoStatus("✅ Position Verified.");
        setGeoLoading(false);
      },
      () => {
        setGeoStatus(`❌ Failed. Enter manually.`);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
    if (localError) setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) return setLocalError("Password too short.");
    if (formData.password !== formData.confirmPassword) return setLocalError("Passwords mismatch.");
    if (formData.role === "donor" && !formData.bloodGroup) return setLocalError("Select blood group.");

    setSubmitting(true);
    await register({
      ...formData,
      email: formData.email.trim().toLowerCase(),
      longitude: formData.longitude || "0",
      latitude: formData.latitude || "0",
    });
    setSubmitting(false);
  };

  return (
    <div className="ll-viewport" style={styles.viewport}>
      {/* Brand Sidebar - Hidden on Mobile */}
      <div className="ll-sidebar" style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          <div style={styles.brandIcon}>🩸</div>
          <h1 style={styles.brandTitle}>LifeLink</h1>
          <p style={styles.brandTag}>INSTITUTIONAL GRADE NETWORK</p>
          <div style={styles.brandDivider} />
          
          <div className="feat-list" style={styles.featList}>
            <div style={styles.featItem}>
              <Shield size={20} color="#be123c" />
              <div>
                <p style={styles.featTitle}>Secure Protocols</p>
                <p style={styles.featText}>Encrypted medical data handling.</p>
              </div>
            </div>
            <div style={styles.featItem}>
              <Zap size={20} color="#be123c" />
              <div>
                <p style={styles.featTitle}>Instant Dispatch</p>
                <p style={styles.featText}>Real-time tracking for urgency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="ll-form-area" style={styles.formArea}>
        <div className="ll-card" style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Enrollment</h2>
            <p style={styles.cardSub}>Join the lifesaving network</p>
          </div>

          {(localError || error) && (
            <div style={styles.errorBox}>⚠️ {localError || error}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.formBody}>
            {/* Role Toggle */}
            <div style={styles.roleToggle}>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: "donor"})}
                style={{...styles.roleBtn, ...(formData.role === "donor" ? styles.roleBtnActive : {})}}
              >
                DONOR
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, role: "medical"})}
                style={{...styles.roleBtn, ...(formData.role === "medical" ? styles.roleBtnActive : {})}}
              >
                MEDICAL
              </button>
            </div>

            <div className="input-row" style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Name / Facility</label>
                <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-row" style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contact Phone</label>
                <input style={styles.input} type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              {formData.role === "donor" && (
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select style={styles.input} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="input-row" style={styles.inputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Security Password</label>
                <input style={styles.input} type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input style={styles.input} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            {/* GPS Section */}
            <div style={styles.gpsPanel}>
              <div style={styles.gpsHeader}>
                <span style={styles.gpsTitle}><MapPin size={14} /> GPS COORDINATES</span>
                <button type="button" onClick={detectLocation} disabled={geoLoading} style={styles.gpsSync}>
                  {geoLoading ? "SYNCING..." : "AUTO-DETECT"}
                </button>
              </div>
              <div className="input-row" style={styles.inputRow}>
                <input style={styles.coordInput} value={formData.latitude} placeholder="Latitude" readOnly />
                <input style={styles.coordInput} value={formData.longitude} placeholder="Longitude" readOnly />
              </div>
              {geoStatus && <p style={styles.geoMsg}>{geoStatus}</p>}
            </div>

            <button type="submit" disabled={submitting} style={styles.submitBtn}>
              {submitting ? "PROCESSING..." : "REGISTER PROFILE"}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.loginLink}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  viewport: { display: "flex", minHeight: "100vh", width: "100vw", overflowX: "hidden" },
  sidebar: { flex: "1", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", color: "#fff" },
  sidebarContent: { maxWidth: "380px" },
  brandIcon: { fontSize: "48px", marginBottom: "20px" },
  brandTitle: { fontSize: "42px", fontWeight: "900", letterSpacing: "-0.05em" },
  brandTag: { fontSize: "11px", fontWeight: "800", color: "#64748b", letterSpacing: "0.2em" },
  brandDivider: { width: "40px", height: "4px", backgroundColor: "#be123c", margin: "30px 0" },
  featList: { display: "flex", flexDirection: "column", gap: "25px" },
  featItem: { display: "flex", gap: "15px", alignItems: "center" },
  featTitle: { fontSize: "14px", fontWeight: "800" },
  featText: { fontSize: "12px", color: "#94a3b8" },

  formArea: { flex: "1.2", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
  card: { width: "100%", maxWidth: "550px", backgroundColor: "#fff", padding: "30px", borderRadius: "24px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" },
  cardHeader: { marginBottom: "25px", textAlign: "center" },
  cardTitle: { fontSize: "28px", fontWeight: "900", color: "#0f172a" },
  cardSub: { fontSize: "14px", color: "#64748b" },

  errorBox: { padding: "12px", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "10px", fontSize: "12px", fontWeight: "700", marginBottom: "20px", textAlign: "center" },
  
  formBody: { display: "flex", flexDirection: "column", gap: "18px" },
  roleToggle: { display: "flex", gap: "5px", background: "#f1f5f9", padding: "5px", borderRadius: "14px" },
  roleBtn: { flex: 1, padding: "12px", border: "none", background: "transparent", fontSize: "12px", fontWeight: "800", color: "#64748b", borderRadius: "10px", cursor: "pointer" },
  roleBtnActive: { background: "#fff", color: "#0f172a", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },

  inputRow: { display: "flex", gap: "15px", flexWrap: "wrap" },
  inputGroup: { flex: "1", minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11px", fontWeight: "800", color: "#475569", textTransform: "uppercase" },
  input: { padding: "14px", border: "2px solid #f1f5f9", borderRadius: "12px", fontSize: "14px", outline: "none", transition: "all 0.2s" },

  gpsPanel: { background: "#f8fafc", padding: "15px", borderRadius: "16px", border: "1px solid #e2e8f0" },
  gpsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  gpsTitle: { fontSize: "10px", fontWeight: "800", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" },
  gpsSync: { border: "none", background: "none", color: "#be123c", fontWeight: "900", fontSize: "10px", cursor: "pointer" },
  coordInput: { flex: 1, padding: "10px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", textAlign: "center", color: "#64748b" },
  geoMsg: { fontSize: "10px", textAlign: "center", color: "#059669", fontWeight: "700", marginTop: "8px" },

  submitBtn: { padding: "16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "14px", fontSize: "14px", fontWeight: "900", cursor: "pointer", transition: "transform 0.1s" },
  footer: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#64748b" },
  loginLink: { color: "#be123c", fontWeight: "800", textDecoration: "none" }
};

const responsiveOverride = document.createElement("style");
responsiveOverride.textContent = `
  @media (max-width: 900px) {
    .ll-sidebar { display: none !important; }
    .ll-form-area { padding: 15px !important; background-color: #0f172a !important; }
    .ll-card { border-radius: 18px !important; padding: 25px 20px !important; max-width: 100% !important; }
    .input-row { flex-direction: column !important; gap: 15px !important; }
    .input-group { min-width: 100% !important; }
    .ll-card-header h2 { font-size: 24px !important; }
  }
  input:focus, select:focus { border-color: #be123c !important; }
`;
document.head.appendChild(responsiveOverride);

export default Register;