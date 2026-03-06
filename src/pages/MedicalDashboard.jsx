


// MedicalDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { searchDonors, getDonorStats, createEmergencyRequest, getEmergencyRequests, getEmergencyHistory, completeEmergencyRequest, cancelEmergencyRequest, rateDonor } from "../services/api";
import Navbar from "../components/Navbar";
import DonorCard from "../components/DonorCard";
import MapView from "../components/MapView";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Activity,
  Users,
  Filter,
  Navigation,
  RefreshCw,
  X,
  Sun,
  Moon,
  Crosshair,
  Radar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Droplet,
  Map,
  List,
  Grid3X3,
  SlidersHorizontal,
  Zap,
  Target,
  Radio,
  Shield,
  Star,
  AlertTriangle,
  Clock,
  Send,
  Phone
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const MedicalDashboard = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [bloodGroup, setBloodGroup] = useState("");
  const [distance, setDistance] = useState(5000);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [minReliability, setMinReliability] = useState(0);
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [donors, setDonors] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid, list, map
  const [showFilters, setShowFilters] = useState(true);

  // Emergency State
  const [emergencies, setEmergencies] = useState([]);
  const [history, setHistory] = useState([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [submittingEmergency, setSubmittingEmergency] = useState(false);
  const [emergencyForm, setEmergencyForm] = useState({
    bloodGroup: "",
    unitsRequired: 1,
    urgencyLevel: "high",
    message: ""
  });

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState({ isOpen: false, requestId: null, donorName: '' });
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-[#0A0A0B]' : 'bg-[#F8F9FA]',
    cardBg: darkMode ? 'bg-[#141415]' : 'bg-white',
    cardBorder: darkMode ? 'border-[#232326]' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-zinc-400' : 'text-gray-600',
    textSubtle: darkMode ? 'text-zinc-500' : 'text-gray-500',
    inputBg: darkMode ? 'bg-[#1A1A1C]' : 'bg-gray-50',
    hoverBg: darkMode ? 'hover:bg-[#1A1A1C]' : 'hover:bg-gray-50',
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await getDonorStats();
      setStats(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchEmergencies = useCallback(async () => {
    try {
      const res = await getEmergencyRequests();
      setEmergencies(res.data.data || []);
    } catch (err) { console.error("Failed to fetch emergencies", err); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await getEmergencyHistory();
      setHistory(res.data.data || []);
    } catch (err) { console.error("Failed to fetch history", err); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchEmergencies();
    fetchHistory();
  }, [fetchStats, fetchEmergencies, fetchHistory]);

  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      const handleEmergencyUpdate = () => {
        fetchEmergencies();
        fetchStats();
      };
      socket.on("request_accepted", handleEmergencyUpdate);
      socket.on("request_completed", handleEmergencyUpdate);
      return () => {
        socket.off("request_accepted", handleEmergencyUpdate);
        socket.off("request_completed", handleEmergencyUpdate);
      };
    }
  }, [socket, fetchEmergencies, fetchStats]);

  // Auto-detect Location from User Profile
  useEffect(() => {
    if (user?.location?.coordinates) {
      const [lng, lat] = user.location.coordinates;
      if (lng !== 0) {
        setLongitude(lng.toString());
        setLatitude(lat.toString());
      }
    }
  }, [user]);

  // GPS Detection
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGeoLoading(false);
        setErrorMessage("");
      },
      (err) => {
        setGeoLoading(false);
        setErrorMessage("Location access denied");
      },
      { enableHighAccuracy: true }
    );
  };

  // Search Donors
  const handleSearch = async () => {
    if (!bloodGroup) {
      setErrorMessage("Select a blood group first");
      return;
    }
    if (!latitude || !longitude) {
      setErrorMessage("Location required for search");
      return;
    }
    setErrorMessage("");
    try {
      setSearching(true);
      const res = await searchDonors({
        bloodGroup,
        longitude: parseFloat(longitude),
        latitude: parseFloat(latitude),
        distance,
        minReliability: minReliability > 0 ? minReliability : undefined,
        onlyEligible
      });
      setDonors(res.data.donors || []);
      setSearchPerformed(true);
    } catch (err) {
      setErrorMessage("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setDonors([]);
    setSearchPerformed(false);
    setBloodGroup("");
    setMinReliability(0);
    setOnlyEligible(false);
  };

  // Emergency Handlers
  const handleCreateEmergency = async (e) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      setErrorMessage("Please set a location first");
      return;
    }

    try {
      setSubmittingEmergency(true);
      const res = await createEmergencyRequest({
        ...emergencyForm,
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      });
      setShowEmergencyModal(false);
      fetchEmergencies();
      setEmergencyForm({ bloodGroup: "", unitsRequired: 1, urgencyLevel: "high", message: "" });
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || "Failed to create emergency request");
    } finally {
      setSubmittingEmergency(false);
    }
  };

  const handleCancelEmergency = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this emergency request?")) return;
    try {
      await cancelEmergencyRequest(id);
      fetchEmergencies();
    } catch (err) {
      console.error("Failed to cancel request", err);
      setErrorMessage("Failed to cancel request");
    }
  };

  const openRatingModal = (req) => {
    setRatingModal({ isOpen: true, requestId: req._id, donorName: req.matchedDonor?.name || "Donor" });
    setRatingValue(5);
  };

  const handleSubmitRating = async () => {
    try {
      setSubmittingRating(true);
      await completeEmergencyRequest(ratingModal.requestId);
      await rateDonor(ratingModal.requestId, ratingValue);
      setRatingModal({ isOpen: false, requestId: null, donorName: '' });
      fetchEmergencies();
    } catch (err) {
      console.error("Failed to rate donor", err);
      setErrorMessage("Failed to complete request & rate donor");
    } finally {
      setSubmittingRating(false);
    }
  };

  const mapCenter = latitude && longitude
    ? [parseFloat(latitude), parseFloat(longitude)]
    : [20.2961, 85.8245];

  const hasLocation = latitude && longitude;

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Navbar />

      {/* Ambient Background */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-red-500/[0.02] rounded-full blur-[120px]" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse`} />
                <span className={`text-sm ${theme.textSubtle}`}>Live Network</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="flex items-center gap-2 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded-full text-xs font-bold transition-all border border-red-600/20"
              >
                <AlertTriangle size={14} />
                CRITICAL REQUEST
              </button>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.text}`}>
              Medical Console
            </h1>
            <p className={`text-sm ${theme.textMuted} mt-1`}>
              Search and locate blood donors in real-time
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.hoverBg} transition-all`}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>

            {/* Refresh Stats */}
            <button
              onClick={fetchStats}
              className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.hoverBg} transition-all`}
            >
              <RefreshCw size={18} className={theme.textMuted} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Total Donors"
            value={stats?.totalDonors || 0}
            color="blue"
            darkMode={darkMode}
            theme={theme}
          />
          <StatCard
            icon={Activity}
            label="Available Now"
            value={stats?.totalAvailable || 0}
            color="emerald"
            darkMode={darkMode}
            theme={theme}
          />
          <StatCard
            icon={Radar}
            label="Search Radius"
            value={`${(distance / 1000).toFixed(0)}km`}
            color="amber"
            darkMode={darkMode}
            theme={theme}
          />
          <StatCard
            icon={Target}
            label="Results Found"
            value={searchPerformed ? donors.length : "—"}
            color="rose"
            darkMode={darkMode}
            theme={theme}
          />
          <StatCard
            icon={Shield}
            label="Eligible Donors"
            value={stats?.eligibleDonors || 0}
            color="amber"
            darkMode={darkMode}
            theme={theme}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left Panel - Search Controls */}
          <div className="lg:col-span-4 space-y-4">

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden`}
            >
              {/* Panel Header */}
              <div className={`flex items-center justify-between p-4 border-b ${theme.cardBorder}`}>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-red-500" />
                  <span className={`font-semibold ${theme.text}`}>Search Filters</span>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-1.5 rounded-lg ${theme.hoverBg} transition-colors`}
                >
                  <ChevronDown
                    size={16}
                    className={`${theme.textMuted} transition-transform ${showFilters ? '' : '-rotate-90'}`}
                  />
                </button>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-6">

                      {/* Error Message */}
                      <AnimatePresence>
                        {errorMessage && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500"
                          >
                            <AlertCircle size={16} />
                            <span className="text-sm font-medium">{errorMessage}</span>
                            <button
                              onClick={() => setErrorMessage("")}
                              className="ml-auto p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Blood Group Selection */}
                      <div>
                        <label className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide mb-3 block`}>
                          Blood Group Required
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {BLOOD_GROUPS.map(bg => (
                            <button
                              key={bg}
                              onClick={() => setBloodGroup(bg)}
                              className={`relative py-3 rounded-xl text-sm font-bold transition-all ${bloodGroup === bg
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                                : `${theme.inputBg} ${theme.textMuted} border ${theme.cardBorder} hover:border-red-500/50`
                                }`}
                            >
                              {bg}
                              {bloodGroup === bg && (
                                <motion.div
                                  layoutId="bloodGroupIndicator"
                                  className="absolute inset-0 bg-red-500 rounded-xl -z-10"
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Advanced Filters */}
                      <div className="space-y-4">
                        <label className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide block`}>
                          Advanced Requirements
                        </label>

                        {/* Eligibility Toggle */}
                        <div
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${onlyEligible
                            ? 'bg-emerald-500/10 border-emerald-500/50'
                            : `${theme.inputBg} ${theme.cardBorder}`
                            }`}
                          onClick={() => setOnlyEligible(!onlyEligible)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${onlyEligible ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'}`}>
                              <Shield size={16} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${theme.text}`}>Strict Eligibility</p>
                              <p className={`text-xs ${theme.textSubtle}`}>Only show donors past 56-day cooldown</p>
                            </div>
                          </div>
                          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${onlyEligible ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-700'}`}>
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${onlyEligible ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </div>

                        {/* Reliability Slider */}
                        <div className={`p-4 rounded-xl border ${theme.cardBorder} ${theme.inputBg}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Star size={16} className={minReliability > 0 ? 'text-amber-500' : theme.textSubtle} />
                              <span className={`text-sm font-semibold ${theme.text}`}>Min. Reliability Score</span>
                            </div>
                            <span className={`text-sm font-bold ${minReliability > 0 ? 'text-amber-500' : theme.textMuted}`}>
                              {minReliability}%+
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={minReliability}
                            onChange={(e) => setMinReliability(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-amber-500"
                            style={{
                              background: darkMode
                                ? `linear-gradient(to right, #f59e0b 0%, #f59e0b ${minReliability}%, #27272a ${minReliability}%, #27272a 100%)`
                                : `linear-gradient(to right, #f59e0b 0%, #f59e0b ${minReliability}%, #e5e7eb ${minReliability}%, #e5e7eb 100%)`
                            }}
                          />
                        </div>
                      </div>

                      {/* Radius Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide`}>
                            Search Radius
                          </label>
                          <span className={`text-sm font-bold ${theme.text}`}>
                            {(distance / 1000).toFixed(1)} km
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="range"
                            min="1000"
                            max="10000"
                            step="500"
                            value={distance}
                            onChange={(e) => setDistance(Number(e.target.value))}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-500"
                            style={{
                              background: darkMode
                                ? `linear-gradient(to right, #ef4444 0%, #ef4444 ${((distance - 1000) / 9000) * 100}%, #27272a ${((distance - 1000) / 9000) * 100}%, #27272a 100%)`
                                : `linear-gradient(to right, #ef4444 0%, #ef4444 ${((distance - 1000) / 9000) * 100}%, #e5e7eb ${((distance - 1000) / 9000) * 100}%, #e5e7eb 100%)`
                            }}
                          />
                          <div className="flex justify-between mt-2">
                            <span className={`text-xs ${theme.textSubtle}`}>1 km</span>
                            <span className={`text-xs ${theme.textSubtle}`}>10 km</span>
                          </div>
                        </div>
                      </div>

                      {/* Location Input */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wide`}>
                            Center Point
                          </label>
                          <button
                            onClick={detectLocation}
                            disabled={geoLoading}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            {geoLoading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Crosshair size={12} />
                            )}
                            {geoLoading ? "Detecting..." : "Auto-detect"}
                          </button>
                        </div>

                        <div className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-4`}>
                          {hasLocation ? (
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} flex items-center justify-center`}>
                                <MapPin size={18} className="text-emerald-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs ${theme.textSubtle} mb-0.5`}>Coordinates</p>
                                <p className={`text-sm font-mono font-medium ${theme.text} truncate`}>
                                  {parseFloat(latitude).toFixed(4)}°, {parseFloat(longitude).toFixed(4)}°
                                </p>
                              </div>
                              <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-zinc-800' : 'bg-gray-100'} flex items-center justify-center`}>
                                <MapPin size={18} className={theme.textSubtle} />
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${theme.textMuted}`}>
                                  No location set
                                </p>
                                <p className={`text-xs ${theme.textSubtle}`}>
                                  Click auto-detect or enter manually
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Manual Input Toggle */}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Latitude"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className={`${theme.inputBg} border ${theme.cardBorder} rounded-lg px-3 py-2 text-xs font-mono ${theme.text} placeholder:${theme.textSubtle} outline-none focus:border-red-500/50 transition-colors`}
                          />
                          <input
                            type="text"
                            placeholder="Longitude"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className={`${theme.inputBg} border ${theme.cardBorder} rounded-lg px-3 py-2 text-xs font-mono ${theme.text} placeholder:${theme.textSubtle} outline-none focus:border-red-500/50 transition-colors`}
                          />
                        </div>
                      </div>

                      {/* Search Button */}
                      <button
                        onClick={handleSearch}
                        disabled={searching || !bloodGroup}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white py-4 rounded-xl font-semibold transition-all disabled:cursor-not-allowed"
                      >
                        {searching ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <Search size={18} />
                            <span>Find Donors</span>
                          </>
                        )}
                      </button>

                      {searchPerformed && (
                        <button
                          onClick={handleClearSearch}
                          className={`w-full flex items-center justify-center gap-2 ${theme.inputBg} border ${theme.cardBorder} ${theme.text} py-3 rounded-xl font-medium transition-all hover:border-red-500/50`}
                        >
                          <X size={16} />
                          <span>Clear Results</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Active Emergencies Overview */}
            {emergencies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-500" />
                  <span className={`text-sm font-bold text-red-500`}>Active Network Tracking</span>
                </div>
                <div className="space-y-3">
                  {emergencies.map((req) => (
                    <div key={req._id} className={`${theme.cardBg} border ${theme.cardBorder} p-3 sm:p-4 rounded-xl flex flex-col gap-3 shadow-sm`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex gap-2 items-center mb-1">
                            <span className="font-bold bg-red-500 text-white px-2 py-0.5 rounded text-xs">{req.bloodGroup}</span>
                            <span className={`text-xs font-semibold ${theme.text}`}>{req.unitsRequired} Unit(s)</span>
                          </div>
                          <p className={`text-xs ${theme.textMuted} mt-2`}>Status:
                            <span className={`ml-1 font-bold ${req.status === 'pending' ? 'text-amber-500' : 'text-blue-500'}`}>
                              {req.status.toUpperCase()}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleCancelEmergency(req._id)}
                          className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors tooltip-cancel"
                          title="Cancel Emergency Request"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* accepted details */}
                      {req.status === 'accepted' && req.matchedDonor && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1.5">
                            <CheckCircle2 size={14} /> Donor En Route
                          </p>
                          <div className={`text-sm ${theme.text} mb-2`}>
                            <span className="font-semibold">{req.matchedDonor.name}</span>
                            <span className={`text-xs ${theme.textMuted} ml-2`}>📞 {req.matchedDonor.phone || 'N/A'}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openRatingModal(req)}
                              className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Shield size={14} /> Complete & Rate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Blood Group Stats */}
            {stats?.bloodGroupBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-4`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Droplet size={16} className="text-red-500" />
                  <span className={`text-sm font-semibold ${theme.text}`}>Availability by Group</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map(bg => {
                    const groupData = stats.bloodGroupBreakdown.find(b => b.bloodGroup === bg);
                    const available = groupData?.available || 0;
                    return (
                      <div
                        key={bg}
                        className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-3 text-center`}
                      >
                        <p className={`text-lg font-bold ${available > 0 ? 'text-red-500' : theme.textSubtle}`}>
                          {available}
                        </p>
                        <p className={`text-xs font-medium ${theme.textMuted}`}>{bg}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Map & Results */}
          <div className="lg:col-span-8 space-y-4">

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {searchPerformed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className={`text-sm font-medium ${theme.text}`}>
                      {donors.length} donor{donors.length !== 1 ? 's' : ''} found
                    </span>
                    {bloodGroup && (
                      <span className="px-2 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold">
                        {bloodGroup}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>

              <div className={`flex items-center gap-1 p-1 rounded-xl ${theme.inputBg} border ${theme.cardBorder}`}>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === "map"
                    ? 'bg-red-500 text-white'
                    : `${theme.textMuted} hover:${theme.text}`
                    }`}
                >
                  <Map size={14} />
                  <span className="hidden sm:inline">Map</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === "grid"
                    ? 'bg-red-500 text-white'
                    : `${theme.textMuted} hover:${theme.text}`
                    }`}
                >
                  <Grid3X3 size={14} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === "list"
                    ? 'bg-red-500 text-white'
                    : `${theme.textMuted} hover:${theme.text}`
                    }`}
                >
                  <List size={14} />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* Map View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden relative`}
            >
              {/* Show Routing Status Overlay if there is an accepted emergency */}
              {(() => {
                const activeAccepted = emergencies.find(req => req.status === 'accepted' && req.matchedDonor);
                if (activeAccepted) {
                  return (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-emerald-500/30 flex items-center gap-2 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tracking Donor Route</span>
                    </div>
                  );
                }
                return null;
              })()}

              <div className={`h-[400px] ${viewMode === "map" ? "h-[500px]" : ""}`}>
                {(() => {
                  let currentRoute = null;
                  let currentCenter = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [20.0, 78.0];

                  // Find if there's an active accepted emergency to show route for
                  const activeAccepted = emergencies.find(req => req.status === 'accepted' && req.matchedDonor && req.location && req.matchedDonor.location);

                  if (activeAccepted && activeAccepted.matchedDonor.location && activeAccepted.location) {
                    // Extract coordinates. GeoJSON is [longitude, latitude]
                    const donorCoords = [activeAccepted.matchedDonor.location.coordinates[1], activeAccepted.matchedDonor.location.coordinates[0]];
                    const hospitalCoords = [activeAccepted.location.coordinates[1], activeAccepted.location.coordinates[0]];

                    currentRoute = [donorCoords, hospitalCoords];
                    // Focus map on the route midpoint or donor
                    currentCenter = donorCoords;
                  }

                  return (
                    <MapView
                      center={currentCenter}
                      donors={donors}
                      radius={distance}
                      searchPerformed={searchPerformed}
                      darkMode={darkMode}
                      route={currentRoute}
                      routeColor="#10b981"
                    />
                  );
                })()}
              </div>
            </motion.div>

            {/* Donation History (Medical) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} flex items-center justify-center`}>
                  <CheckCircle2 size={20} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme.text}`}>Successfully Completed Requests</h3>
                  <p className={`text-sm ${theme.textSubtle}`}>Past donors and fulfillments</p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className={`text-center p-6 rounded-xl border border-dashed ${theme.cardBorder}`}>
                  <p className={`text-sm ${theme.textMuted}`}>No completed requests yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((req) => (
                    <div key={req._id} className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-4 flex justify-between items-center flex-wrap gap-4`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">{req.bloodGroup}</span>
                          <span className={`font-semibold ${theme.text}`}>{req.matchedDonor?.name || "Unknown Donor"}</span>
                        </div>
                        <p className={`text-xs ${theme.textMuted} flex items-center gap-1.5`}>
                          <Clock size={12} />
                          {new Date(req.completedAt).toLocaleDateString()} at {new Date(req.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <span className="mx-1">•</span>
                          <Phone size={12} /> {req.matchedDonor?.phone || "N/A"}
                        </p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <div className="text-right">
                          <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/20">
                            {req.unitsRequired} Unit(s) Received
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Results Grid/List */}
            <AnimatePresence>
              {searchPerformed && donors.length > 0 && viewMode !== "map" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className={`grid gap-4 ${viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1"
                    }`}>
                    {donors.map((donor, index) => (
                      <DonorCard
                        key={donor._id}
                        donor={donor}
                        index={index}
                        darkMode={darkMode}
                        theme={theme}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {searchPerformed && donors.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-12 text-center`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${darkMode ? 'bg-zinc-800' : 'bg-gray-100'} flex items-center justify-center`}>
                  <Search size={24} className={theme.textSubtle} />
                </div>
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No donors found</h3>
                <p className={`text-sm ${theme.textMuted} max-w-sm mx-auto`}>
                  Try expanding your search radius or selecting a different blood group.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-12 text-center ${theme.textSubtle} text-sm`}>
          <p>Real-time data • Auto-refreshes every 30 seconds</p>
        </div>
      </div>

      {/* Emergency Request Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEmergencyModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-lg ${theme.cardBg} border ${theme.cardBorder} rounded-3xl shadow-2xl overflow-hidden`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                      <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${theme.text}`}>Emergency Request</h2>
                      <p className={`text-sm ${theme.textMuted}`}>Broadcast to eligible donors nearby</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className={`p-2 rounded-xl ${theme.hoverBg} transition-colors`}
                  >
                    <X size={20} className={theme.textSubtle} />
                  </button>
                </div>

                <form onSubmit={handleCreateEmergency} className="space-y-5">
                  <div>
                    <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-2`}>
                      Blood Group Needed
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {BLOOD_GROUPS.map(bg => (
                        <button
                          key={`em-${bg}`}
                          type="button"
                          onClick={() => setEmergencyForm({ ...emergencyForm, bloodGroup: bg })}
                          className={`py-3 rounded-xl text-sm font-bold transition-all border ${emergencyForm.bloodGroup === bg
                            ? 'bg-red-500 text-white border-red-500'
                            : `${theme.inputBg} ${theme.textMuted} ${theme.cardBorder} hover:border-red-500/50`
                            }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-2`}>
                        Units Required
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={emergencyForm.unitsRequired}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, unitsRequired: Number(e.target.value) })}
                        className={`w-full ${theme.inputBg} border ${theme.cardBorder} rounded-xl px-4 py-3 ${theme.text} font-semibold focus:border-red-500/50 outline-none`}
                        required
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-2`}>
                        Urgency Level
                      </label>
                      <select
                        value={emergencyForm.urgencyLevel}
                        onChange={(e) => setEmergencyForm({ ...emergencyForm, urgencyLevel: e.target.value })}
                        className={`w-full ${theme.inputBg} border ${theme.cardBorder} rounded-xl px-4 py-3 ${theme.text} font-semibold focus:border-red-500/50 outline-none appearance-none cursor-pointer`}
                      >
                        <option value="high">High (Needs today)</option>
                        <option value="critical">Critical (Immediate)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-2`}>
                      Additional Message (Optional)
                    </label>
                    <textarea
                      value={emergencyForm.message}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, message: e.target.value })}
                      className={`w-full ${theme.inputBg} border ${theme.cardBorder} rounded-xl px-4 py-3 ${theme.text} font-medium focus:border-red-500/50 outline-none resize-none`}
                      rows="3"
                      placeholder="e.g. Critical condition, please contact ASAP"
                    ></textarea>
                  </div>

                  {!latitude || !longitude ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 text-amber-500 font-medium text-sm">
                      <MapPin size={16} />
                      Location must be set to create emergency request
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submittingEmergency || !emergencyForm.bloodGroup || !latitude}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-xl py-4 font-bold text-lg shadow-xl shadow-red-600/20 transition-all disabled:cursor-not-allowed mt-2"
                  >
                    {submittingEmergency ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {submittingEmergency ? "Broadcasting..." : "BROADCAST EMERGENCY"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rating & Completion Modal */}
      <AnimatePresence>
        {ratingModal.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !submittingRating && setRatingModal({ isOpen: false, requestId: null, donorName: '' })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-sm ${theme.cardBg} border ${theme.cardBorder} rounded-3xl shadow-2xl overflow-hidden`}
            >
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="text-emerald-500" />
                </div>
                <h3 className={`text-xl font-bold text-center mb-2 ${theme.text}`}>Rate Donor</h3>
                <p className={`text-sm text-center ${theme.textMuted} mb-6`}>
                  How was your experience with <span className="font-bold text-red-500">{ratingModal.donorName}</span>?
                </p>

                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingValue(star)}
                      className={`p-2 transition-transform hover:scale-110 active:scale-95`}
                    >
                      <Star
                        size={32}
                        fill={ratingValue >= star ? "#10b981" : "transparent"}
                        className={ratingValue >= star ? "text-emerald-500" : theme.textSubtle}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setRatingModal({ isOpen: false, requestId: null, donorName: '' })}
                    disabled={submittingRating}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm ${theme.inputBg} ${theme.text} hover:bg-opacity-80 transition-all`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRating}
                    disabled={submittingRating}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center"
                  >
                    {submittingRating ? <Loader2 size={18} className="animate-spin" /> : "Submit"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div >
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, darkMode, theme }) => {
  const colorMap = {
    blue: { bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', text: 'text-blue-500' },
    emerald: { bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', text: 'text-emerald-500' },
    amber: { bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', text: 'text-amber-500' },
    rose: { bg: darkMode ? 'bg-rose-500/10' : 'bg-rose-50', text: 'text-rose-500' },
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-4 sm:p-5`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon size={20} className={colors.text} />
        </div>
        <div>
          <p className={`text-xl sm:text-2xl font-bold ${theme.text}`}>{value}</p>
          <p className={`text-xs ${theme.textMuted}`}>{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicalDashboard;