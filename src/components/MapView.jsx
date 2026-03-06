
// components/MapView.jsx
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom Icons
const createCustomIcon = (color, emoji, size = 40) => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: translateX(-50%) rotate(-45deg);
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        "></div>
        <span style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          font-size: ${size * 0.4}px;
          line-height: 1;
          z-index: 1;
        ">${emoji}</span>
      </div>
    `,
    className: "custom-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const hospitalIcon = createCustomIcon("#3b82f6", "🏥", 44);
const donorCloseIcon = createCustomIcon("#10b981", "🩸", 38);
const donorMidIcon = createCustomIcon("#f59e0b", "🩸", 38);
const donorFarIcon = createCustomIcon("#ef4444", "🩸", 38);

const getDonorIcon = (distanceInMeters) => {
  if (distanceInMeters <= 1000) return donorCloseIcon;
  if (distanceInMeters <= 3000) return donorMidIcon;
  return donorFarIcon;
};

// Recenter map component
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
};

// Fit bounds component
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
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
      }
    }
  }, [donors, center, map]);
  return null;
};

// Main Component
const MapView = ({ center, donors = [], radius = 5000, searchPerformed, darkMode = true, route = null, routeColor = "#3b82f6" }) => {
  const defaultCenter = [28.6139, 77.209];
  const mapCenter = center && center[0] !== 0 && center[1] !== 0 ? center : defaultCenter;

  // Map tile URLs
  const lightTiles = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const darkTiles = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-full z-0"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={darkMode ? darkTiles : lightTiles}
        />

        <RecenterMap center={mapCenter} zoom={13} />

        {searchPerformed && donors.length > 0 && (
          <FitBounds donors={donors} center={mapCenter} />
        )}

        {/* Route Polyline */}
        {route && route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: routeColor,
              weight: 4,
              opacity: 0.8,
              dashArray: "10 8",
              lineJoin: "round"
            }}
          />
        )}

        {/* Search Radius */}
        {searchPerformed && center && center[0] !== 0 && !route && (
          <Circle
            center={mapCenter}
            radius={radius}
            pathOptions={{
              color: "#ef4444",
              fillColor: "#ef4444",
              fillOpacity: 0.08,
              weight: 2,
              dashArray: "8 4",
            }}
          />
        )}

        {/* Hospital Marker */}
        {center && center[0] !== 0 && (
          <Marker position={mapCenter} icon={hospitalIcon}>
            <Popup>
              <div className="min-w-[200px]">
                <div className="bg-blue-500 text-white px-4 py-3 -mx-5 -mt-3 mb-3 rounded-t-lg flex items-center gap-2">
                  <span className="text-lg">🏥</span>
                  <span className="font-semibold">Your Location</span>
                </div>
                <div className="px-1 pb-2">
                  <p className="text-sm text-gray-600 mb-2">Medical Facility</p>
                  <p className="text-xs font-mono text-gray-500 mb-3">
                    {mapCenter[0].toFixed(4)}°N, {mapCenter[1].toFixed(4)}°E
                  </p>
                  <div className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-lg">
                    Search Radius: {(radius / 1000).toFixed(1)} km
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Donor Markers */}
        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={50}
          showCoverageOnHover={false}
        >
          {donors.map((donor, idx) => {
            if (!donor.location?.coordinates) return null;
            const [lng, lat] = donor.location.coordinates;

            return (
              <Marker
                key={donor._id || idx}
                position={[lat, lng]}
                icon={getDonorIcon(donor.distanceInMeters)}
              >
                <Popup>
                  <div className="min-w-[220px]">
                    {/* Header */}
                    <div className="bg-red-500 text-white px-4 py-3 -mx-5 -mt-3 mb-3 rounded-t-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🩸</span>
                        <span className="font-semibold">Donor #{idx + 1}</span>
                      </div>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="px-1 pb-2">
                      <p className="font-semibold text-gray-900 mb-3">{donor.name}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span>📧</span>
                          <span className="text-gray-600 truncate">{donor.email}</span>
                        </div>
                        {donor.phone && (
                          <div className="flex items-center gap-2">
                            <span>📱</span>
                            <span className="text-gray-600">{donor.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="text-gray-600">
                            {donor.distanceInKm < 1
                              ? `${donor.distanceInMeters}m away`
                              : `${donor.distanceInKm?.toFixed(1) || '?'}km away`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{donor.isAvailable ? "🟢" : "🔴"}</span>
                          <span className={`font-semibold ${donor.isAvailable ? 'text-emerald-600' : 'text-red-600'}`}>
                            {donor.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        {donor.phone && (
                          <a
                            href={`tel:${donor.phone}`}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-center rounded-lg text-sm font-semibold transition-colors"
                          >
                            📞 Call
                          </a>
                        )}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-center rounded-lg text-sm font-semibold border border-blue-200 transition-colors"
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
        </MarkerClusterGroup>
      </MapContainer>

      {/* Legend */}
      <div className={`absolute bottom-4 left-4 z-[1000] ${darkMode ? 'bg-zinc-900/95' : 'bg-white/95'
        } backdrop-blur-sm rounded-xl p-3 shadow-lg border ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow" />
            <span className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow" />
            <span className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>&lt;1km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow" />
            <span className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>1-3km</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" />
            <span className={darkMode ? 'text-zinc-300' : 'text-gray-600'}>&gt;3km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inject styles
const mapStyles = document.createElement("style");
mapStyles.textContent = `
  .custom-marker {
    background: transparent !important;
    border: none !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 12px !important;
    padding: 0 !important;
    overflow: hidden;
  }
  .leaflet-popup-content {
    margin: 12px 20px !important;
  }
  .leaflet-popup-close-button {
    color: #9ca3af !important;
    font-size: 20px !important;
    top: 8px !important;
    right: 10px !important;
  }
  .leaflet-popup-close-button:hover {
    color: #ef4444 !important;
  }
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }
  .leaflet-control-zoom a {
    background: #18181b !important;
    color: #fafafa !important;
    border: none !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 18px !important;
  }
  .leaflet-control-zoom a:hover {
    background: #27272a !important;
  }
  .leaflet-control-zoom-in {
    border-radius: 10px 10px 0 0 !important;
  }
  .leaflet-control-zoom-out {
    border-radius: 0 0 10px 10px !important;
  }
`;
document.head.appendChild(mapStyles);

export default MapView;