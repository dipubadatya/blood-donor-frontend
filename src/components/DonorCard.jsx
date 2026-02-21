

import React from "react";

const DonorCard = ({ donor, index }) => {
  const {
    name,
    email,
    phone,
    bloodGroup,
    isAvailable,
    distanceInMeters,
    distanceInKm,
  } = donor;

  const formatDistance = () => {
    if (distanceInKm !== undefined) {
      return distanceInKm < 1 ? `${distanceInMeters}m` : `${distanceInKm}km`;
    }
    return "--";
  };

  // Color mapping for distance urgency
  const getUrgencyStyles = () => {
    if (distanceInMeters <= 1000) return { color: "#059669", bg: "#ecfdf5" };
    if (distanceInMeters <= 3000) return { color: "#d97706", bg: "#fffbeb" };
    return { color: "#dc2626", bg: "#fef2f2" };
  };

  const urgency = getUrgencyStyles();

  return (
    <div className="ll-donor-card" style={styles.card}>
      {/* Visual Indicator of Proximity */}
      <div style={{ ...styles.proximityLine, backgroundColor: urgency.color }} />

      <div style={styles.cardContent}>
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <span style={styles.idNumber}>Record #{String(index + 1).padStart(3, '0')}</span>
            <div style={{ ...styles.distTag, backgroundColor: urgency.bg, color: urgency.color }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {formatDistance()}
            </div>
          </div>

          <div style={styles.profileRow}>
            <div style={styles.avatar}>{name?.charAt(0)}</div>
            <div style={styles.mainInfo}>
              <h3 style={styles.name}>{name}</h3>
              <p style={styles.subtext}>{email}</p>
            </div>
            <div style={styles.bloodType}>{bloodGroup}</div>
          </div>
        </div>

        <div style={styles.dataGrid}>
          <div style={styles.dataItem}>
            <label style={styles.label}>Contact Reference</label>
            <div style={styles.value}>{phone || "Secure / Private"}</div>
          </div>
          <div style={styles.dataItem}>
            <label style={styles.label}>Availability Status</label>
            <div style={{ ...styles.value, color: isAvailable ? "#059669" : "#dc2626" }}>
              <span style={{ ...styles.dot, backgroundColor: isAvailable ? "#10b981" : "#ef4444" }} />
              {isAvailable ? "Ready to Donate" : "Currently Offline"}
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <a href={`tel:${phone}`} style={styles.primaryAction}>
            Initiate Contact
          </a>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${donor.location?.coordinates?.[1]},${donor.location?.coordinates?.[0]}`}
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.secondaryAction}
          >
            Route
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.03)",
    transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
  },
  proximityLine: {
    height: "4px",
    width: "100%",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idNumber: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: "0.05em",
    fontFamily: "monospace",
  },
  distTag: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
  },
  profileRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    backgroundColor: "#1e293b",
    color: "#fff",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  mainInfo: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.01em",
  },
  subtext: {
    margin: 0,
    fontSize: "13px",
    color: "#64748b",
  },
  bloodType: {
    backgroundColor: "#be123c",
    color: "#fff",
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "18px",
  },
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
  },
  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  footer: {
    display: "flex",
    gap: "10px",
    marginTop: "4px",
  },
  primaryAction: {
    flex: 2,
    backgroundColor: "#0f172a",
    color: "#fff",
    textDecoration: "none",
    textAlign: "center",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    transition: "background 0.2s",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: "#f8fafc",
    color: "#475569",
    textDecoration: "none",
    textAlign: "center",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    border: "1px solid #e2e8f0",
  },
};

// CSS for human-like interaction
const styleInjection = document.createElement("style");
styleInjection.textContent = `
  .ll-donor-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15) !important;
  }
  .ll-donor-card a:hover {
    filter: brightness(1.1);
  }
  @media (max-width: 400px) {
    .ll-donor-card { padding: 15px !important; }
    .ll-blood-type { font-size: 14px !important; width: 40px !important; height: 40px !important; }
  }
`;
document.head.appendChild(styleInjection);

export default DonorCard;