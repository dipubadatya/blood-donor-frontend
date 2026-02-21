import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// ─── Fix Leaflet default marker icon issue with bundlers ───
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ─── Custom Icons ───
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #ffffff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        position: relative;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 16px;
          line-height: 1;
        ">${emoji}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const hospitalIcon = createCustomIcon("#3b82f6", "🏥");
const donorIcon = createCustomIcon("#dc2626", "🩸");
const donorFarIcon = createCustomIcon("#f97316", "🩸");
const donorCloseIcon = createCustomIcon("#16a34a", "🩸");

const getDonorIcon = (distanceInMeters) => {
  if (distanceInMeters <= 1000) return donorCloseIcon;
  if (distanceInMeters <= 3000) return donorIcon;
  return donorFarIcon;
};

// ─── Component to recenter map when center changes ───
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, zoom || 13, { duration: 1.5 });
    }
  }, [center, zoom, map]);

  return null;
};

// ─── Fit map to show all markers ───
const FitBounds = ({ donors, center }) => {
  const map = useMap();

  useEffect(() => {
    if (donors && donors.length > 0 && center) {
      const points = [center];
      donors.forEach((d) => {
        if (d.location?.coordinates) {
          points.push([d.location.coordinates[1], d.location.coordinates[0]]);
        }
      });

      if (points.length > 1) {
        const bounds = L.latLngBounds(points);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [donors, center, map]);

  return null;
};

// ─── Main MapView Component ───
const MapView = ({ center, donors = [], radius = 5000, searchPerformed }) => {
  const mapRef = useRef(null);

  // Default center (India - Delhi)
  const defaultCenter = [28.6139, 77.209];
  const mapCenter =
    center && center[0] !== 0 && center[1] !== 0 ? center : defaultCenter;

  return (
    <div style={styles.mapWrapper}>
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={styles.mapContainer}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* ─── OpenStreetMap Tiles ─── */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ─── Recenter on search ─── */}
        <RecenterMap center={mapCenter} zoom={13} />

        {/* ─── Fit bounds to show all donors ─── */}
        {searchPerformed && donors.length > 0 && (
          <FitBounds donors={donors} center={mapCenter} />
        )}

        {/* ─── Search Radius Circle ─── */}
        {searchPerformed && center && center[0] !== 0 && (
          <Circle
            center={mapCenter}
            radius={radius}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#dc2626",
              fillOpacity: 0.06,
              weight: 2,
              dashArray: "8 4",
            }}
          />
        )}

        {/* ─── Hospital/Medical Facility Marker ─── */}
        {center && center[0] !== 0 && (
          <Marker position={mapCenter} icon={hospitalIcon}>
            <Popup>
              <div style={styles.popupContent}>
                <div style={styles.popupHeader}>
                  <span style={styles.popupHeaderIcon}>🏥</span>
                  <span style={styles.popupHeaderText}>Your Location</span>
                </div>
                <div style={styles.popupBody}>
                  <p style={styles.popupLabel}>Medical Facility</p>
                  <p style={styles.popupCoords}>
                    {mapCenter[0].toFixed(4)}°N, {mapCenter[1].toFixed(4)}°E
                  </p>
                  <div style={styles.popupRadiusBadge}>
                    Search Radius: {(radius / 1000).toFixed(1)} km
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ─── Donor Markers ─── */}
        {donors.map((donor, idx) => {
          if (!donor.location?.coordinates) return null;

          const [lng, lat] = donor.location.coordinates;
          const position = [lat, lng];

          return (
            <Marker
              key={donor._id || idx}
              position={position}
              icon={getDonorIcon(donor.distanceInMeters)}
            >
              <Popup>
                <div style={styles.popupContent}>
                  {/* Popup Header */}
                  <div
                    style={{
                      ...styles.popupHeader,
                      backgroundColor: "#dc2626",
                    }}
                  >
                    <span style={styles.popupHeaderIcon}>🩸</span>
                    <span style={styles.popupHeaderText}>
                      Donor #{idx + 1}
                    </span>
                    <span style={styles.popupBloodBadge}>
                      {donor.bloodGroup}
                    </span>
                  </div>

                  {/* Popup Body */}
                  <div style={styles.popupBody}>
                    <p style={styles.popupName}>{donor.name}</p>

                    <div style={styles.popupInfoRow}>
                      <span>📧</span>
                      <span style={styles.popupInfoText}>{donor.email}</span>
                    </div>

                    {donor.phone && (
                      <div style={styles.popupInfoRow}>
                        <span>📱</span>
                        <span style={styles.popupInfoText}>{donor.phone}</span>
                      </div>
                    )}

                    <div style={styles.popupInfoRow}>
                      <span>📍</span>
                      <span style={styles.popupInfoText}>
                        {donor.distanceInKm !== undefined
                          ? donor.distanceInKm < 1
                            ? `${donor.distanceInMeters}m away`
                            : `${donor.distanceInKm} km away`
                          : "Distance unknown"}
                      </span>
                    </div>

                    <div style={styles.popupInfoRow}>
                      <span>{donor.isAvailable ? "🟢" : "🔴"}</span>
                      <span
                        style={{
                          ...styles.popupInfoText,
                          color: donor.isAvailable ? "#16a34a" : "#dc2626",
                          fontWeight: "700",
                        }}
                      >
                        {donor.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.popupActions}>
                      {donor.phone && (
                        <a
                          href={`tel:${donor.phone}`}
                          style={styles.popupCallBtn}
                        >
                          📞 Call
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.popupDirBtn}
                      >
                        🗺️ Navigate
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ─── Map Legend ─── */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#3b82f6" }}></span>
          <span style={styles.legendText}>Your Location</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#16a34a" }}></span>
          <span style={styles.legendText}>&lt; 1 km</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#dc2626" }}></span>
          <span style={styles.legendText}>1–3 km</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, backgroundColor: "#f97316" }}></span>
          <span style={styles.legendText}>&gt; 3 km</span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────
const styles = {
  mapWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    border: "2px solid #e5e7eb",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  mapContainer: {
    width: "100%",
    height: "500px",
    zIndex: 1,
  },

  /* ─── Legend ─── */
  legend: {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    padding: "10px 14px",
    borderRadius: "10px",
    display: "flex",
    gap: "14px",
    zIndex: 1000,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    border: "1px solid #e5e7eb",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    border: "2px solid #ffffff",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
  legendText: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#374151",
    whiteSpace: "nowrap",
  },

  /* ─── Popup Styles ─── */
  popupContent: {
    width: "240px",
    overflow: "hidden",
  },
  popupHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  },
  popupHeaderIcon: {
    fontSize: "16px",
  },
  popupHeaderText: {
    fontSize: "13px",
    fontWeight: "700",
    flex: 1,
  },
  popupBloodBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "800",
    padding: "3px 10px",
    borderRadius: "6px",
  },
  popupBody: {
    padding: "12px 14px",
  },
  popupLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px",
  },
  popupCoords: {
    fontSize: "12px",
    color: "#6b7280",
    fontFamily: "'Courier New', monospace",
    marginBottom: "8px",
  },
  popupRadiusBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
  },
  popupName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "10px",
  },
  popupInfoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 0",
    fontSize: "13px",
  },
  popupInfoText: {
    fontSize: "12px",
    color: "#374151",
  },
  popupActions: {
    display: "flex",
    gap: "6px",
    marginTop: "12px",
  },
  popupCallBtn: {
    flex: 1,
    padding: "7px 0",
    fontSize: "12px",
    fontWeight: "700",
    color: "#ffffff",
    backgroundColor: "#16a34a",
    borderRadius: "8px",
    textAlign: "center",
    textDecoration: "none",
  },
  popupDirBtn: {
    flex: 1,
    padding: "7px 0",
    fontSize: "12px",
    fontWeight: "700",
    color: "#3b82f6",
    backgroundColor: "#eff6ff",
    borderRadius: "8px",
    textAlign: "center",
    textDecoration: "none",
    border: "1px solid #dbeafe",
  },
};

// Inject marker animation
const mapStyles = document.createElement("style");
mapStyles.textContent = `
  .custom-marker {
    background: transparent !important;
    border: none !important;
  }
  .leaflet-popup-close-button {
    color: #6b7280 !important;
    font-size: 18px !important;
    padding: 6px 8px !important;
  }
  .leaflet-popup-close-button:hover {
    color: #dc2626 !important;
  }
`;
document.head.appendChild(mapStyles);

export default MapView;