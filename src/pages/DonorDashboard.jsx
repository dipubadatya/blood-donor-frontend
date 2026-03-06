

//  DonorDashboard;

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  toggleAvailability as toggleAvailabilityAPI,
  updateLocation as updateLocationAPI,
  getUserProfile,
  updateProfile as updateProfileAPI,
  getEmergencyRequests,
  getEmergencyHistory,
  acceptEmergencyRequest
} from "../services/api";
import { useSocket } from "../context/SocketContext";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Activity,
  MapPin,
  Shield,
  RefreshCw,
  Power,
  Edit3,
  Check,
  X,
  Sun,
  Moon,
  Signal,
  Heart,
  Clock,
  Navigation,
  Eye,
  EyeOff,
  Zap,
  Mail,
  Phone,
  Droplet,
  Radio,
  Wifi,
  WifiOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  Lock,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

// Haversine distance calculation in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Emergency State
  const [emergencies, setEmergencies] = useState([]);
  const [history, setHistory] = useState([]);
  const [acceptingId, setAcceptingId] = useState(null);

  const { socket } = useSocket();

  const data = profile || user;
  const hasLocation = data?.location?.coordinates?.some(c => c !== 0);

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

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res.data.user);
      setEditData({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone,
        bloodGroup: res.data.user.bloodGroup,
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmergencies = useCallback(async () => {
    try {
      const res = await getEmergencyRequests();
      setEmergencies(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch emergencies:", err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await getEmergencyHistory();
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchEmergencies();
    fetchHistory();
  }, [fetchProfile, fetchEmergencies, fetchHistory]);

  useEffect(() => {
    if (socket) {
      socket.on("emergency_created", (data) => {
        // Only add if blood group matches, though backend might pre-filter
        if (data.request.bloodGroup === profile?.bloodGroup) {
          setEmergencies((prev) => [data.request, ...prev]);
        }
      });
      socket.on("request_completed", (data) => {
        setEmergencies((prev) => prev.filter(req => req._id !== data.request._id));
      });
    }
    return () => {
      if (socket) {
        socket.off("emergency_created");
        socket.off("request_completed");
      }
    };
  }, [socket, profile]);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await updateProfileAPI(editData);
      setProfile(res.data.user);
      updateUser(res.data.user);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsSyncing(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          longitude: parseFloat(pos.coords.longitude.toFixed(6)),
          latitude: parseFloat(pos.coords.latitude.toFixed(6)),
        };
        try {
          const res = await updateLocationAPI(coords);
          setProfile((prev) => ({ ...prev, location: res.data.location }));
          updateUser({ location: res.data.location });
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 3000);
        } catch (err) {
          console.error("Location Upload Failed", err);
        } finally {
          setIsSyncing(false);
        }
      },
      (err) => {
        setIsSyncing(false);
        console.error("GPS Error:", err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleToggleAvailability = async () => {
    try {
      setIsToggling(true);
      const res = await toggleAvailabilityAPI();
      const newAvailability = res.data.isAvailable;
      setProfile((prev) => ({ ...prev, isAvailable: newAvailability }));
      updateUser({ isAvailable: newAvailability });
    } catch (err) {
      console.error("Toggle Failed", err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleAcceptEmergency = async (id) => {
    try {
      setAcceptingId(id);
      await acceptEmergencyRequest(id);
      // Refresh list to update status
      fetchEmergencies();
    } catch (err) {
      console.error("Accept Failed", err);
      alert(err.response?.data?.message || "Failed to accept request");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      bloodGroup: data?.bloodGroup,
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen ${theme.bg}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center">
              <Loader2 className="text-white animate-spin" size={28} />
            </div>
          </div>
          <p className={`text-sm font-medium ${theme.textMuted}`}>Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <Navbar />

      {/* Ambient Background */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-500/[0.02] rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-rose-500/[0.02] rounded-full blur-[120px]" />
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Left - Welcome */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm ${theme.textSubtle}`}>{currentDate}</span>
              <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
              <span className={`text-sm ${theme.textSubtle}`}>{currentTime}</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${theme.text}`}>
              Welcome back, <span className="text-red-500">{data?.name?.split(' ')[0]}</span>
            </h1>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.hoverBg} transition-all`}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>

            {/* Edit/Save Button */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={handleCancelEdit}
                    className={`p-2.5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} transition-all`}
                  >
                    <X size={18} className={theme.textMuted} />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="edit"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${theme.cardBg} border ${theme.cardBorder} ${theme.hoverBg} transition-all`}
                >
                  <Edit3 size={16} className={theme.textMuted} />
                  <span className={`text-sm font-medium ${theme.text}`}>Edit</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500 text-white shadow-lg"
            >
              <CheckCircle2 size={18} />
              <span className="font-medium text-sm">Profile updated successfully</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

          {/* Left Column */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6 relative overflow-hidden`}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${data?.isAvailable
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${data?.isAvailable ? 'bg-emerald-500 animate-pulse' : darkMode ? 'bg-zinc-600' : 'bg-gray-400'}`} />
                  {data?.isAvailable ? 'Online' : 'Offline'}
                </div>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-2xl font-bold`}>
                    {data?.name?.charAt(0).toUpperCase()}
                  </div>
                  {data?.isAvailable && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg border-4 border-[#141415] flex items-center justify-center">
                      <Wifi size={10} className="text-white" />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className={`text-xl font-bold text-center ${theme.text} ${theme.inputBg} border ${theme.cardBorder} rounded-lg px-3 py-2 w-full outline-none focus:border-red-500 transition-colors`}
                  />
                ) : (
                  <h2 className={`text-xl font-bold ${theme.text}`}>{data?.name}</h2>
                )}
                <p className={`text-sm ${theme.textMuted} mt-1`}>Blood Donor</p>
              </div>

              {/* Blood Group Badge */}
              <div className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                      <Droplet size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className={`text-xs ${theme.textSubtle} mb-0.5`}>Blood Group</p>
                      {isEditing ? (
                        <select
                          value={editData.bloodGroup}
                          onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                          className={`font-bold text-red-500 ${theme.inputBg} outline-none cursor-pointer`}
                        >
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-2xl font-bold text-red-500">{data?.bloodGroup}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${theme.textSubtle}`}>Status</p>
                    <p className={`text-sm font-medium ${data?.isAvailable ? 'text-emerald-500' : theme.textMuted}`}>
                      {data?.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className={`flex items-center gap-3 p-3 rounded-xl ${theme.inputBg} border ${theme.cardBorder}`}>
                  <Mail size={16} className={theme.textSubtle} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className={`flex-1 text-sm ${theme.text} bg-transparent outline-none`}
                      placeholder="Email address"
                    />
                  ) : (
                    <span className={`text-sm ${theme.text} truncate`}>{data?.email}</span>
                  )}
                </div>

                <div className={`flex items-center gap-3 p-3 rounded-xl ${theme.inputBg} border ${theme.cardBorder}`}>
                  <Phone size={16} className={theme.textSubtle} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className={`flex-1 text-sm ${theme.text} bg-transparent outline-none`}
                      placeholder="Phone number"
                    />
                  ) : (
                    <span className={`text-sm ${data?.phone ? theme.text : theme.textSubtle}`}>
                      {data?.phone || 'Add phone number'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-4`}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className={`${theme.inputBg} rounded-xl p-4 text-center`}>
                  <Heart size={20} className="text-red-500 mx-auto mb-2" />
                  <p className={`text-2xl font-bold ${theme.text}`}>{data?.completedDonations || 0}</p>
                  <p className={`text-xs ${theme.textSubtle}`}>Donations</p>
                </div>
                <div className={`${theme.inputBg} rounded-xl p-4 text-center`}>
                  <Clock size={20} className="text-amber-500 mx-auto mb-2" />
                  <p className={`text-sm mt-2 font-bold ${theme.text}`}>{data?.lastDonationDate ? new Date(data.lastDonationDate).toLocaleDateString() : '—'}</p>
                  <p className={`text-xs ${theme.textSubtle}`}>Last Donation</p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className={`text-xs font-semibold uppercase tracking-wide ${data?.reliabilityScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  Reliability Score: {data?.reliabilityScore || 100}%
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">

            {/* Active Emergencies for Donor */}
            <AnimatePresence>
              {emergencies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <h3 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <AlertTriangle className="text-red-500" size={24} />
                    Emergency Alerts ({emergencies.length})
                  </h3>

                  {emergencies.map((req) => (
                    <div key={req._id} className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] pointer-events-none" />

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                            CRITICAL
                          </span>
                          <span className={`${theme.textMuted} text-xs font-semibold`}>
                            {new Date(req.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className={`font-bold text-lg mb-1 ${theme.text}`}>
                          {req.unitsRequired} Unit(s) of <span className="text-red-500">{req.bloodGroup}</span> Blood Needed
                        </h4>
                        <p className={`text-sm ${theme.textMuted} flex items-center gap-1.5`}>
                          <MapPin size={14} />
                          {req.hospital?.name || "Verified Hospital"}
                        </p>
                        {req.message && (
                          <p className={`text-sm mt-2 italic border-l-2 border-red-500/30 pl-3 ${theme.textSubtle}`}>
                            "{req.message}"
                          </p>
                        )}
                      </div>

                      <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
                        {req.status === 'accepted' && req.matchedDonor === user?._id ? (
                          <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm">
                            <CheckCircle2 size={18} /> Accepted & En Route
                          </div>
                        ) : req.status === 'accepted' ? (
                          <div className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${theme.inputBg} ${theme.textMuted}`}>
                            Accepted by another donor
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAcceptEmergency(req._id)}
                            disabled={acceptingId === req._id || !data?.isAvailable}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                              ${!data?.isAvailable
                                ? 'opacity-50 cursor-not-allowed bg-gray-500/20 text-gray-400'
                                : 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 active:scale-95'
                              }`
                            }
                          >
                            {acceptingId === req._id ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} />}
                            {!data?.isAvailable ? 'Go Online to Accept' : 'Accept Request'}
                          </button>
                        )}
                      </div>                    {/* Expanded view for Accepted Requests */}
                      {
                        req.status === 'accepted' && req.matchedDonor === user?._id && hasLocation && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-4 border ${theme.cardBorder} rounded-2xl overflow-hidden`}
                          >
                            {/* Hospital Details & Navigation Context */}
                            <div className={`p-5 ${theme.cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${theme.cardBorder}`}>
                              <div>
                                <h4 className={`text-lg font-bold flex items-center gap-2 ${theme.text}`}>
                                  <span className="text-2xl">🏥</span> {req.hospital?.name}
                                </h4>
                                <div className={`mt-2 space-y-1 text-sm ${theme.textMuted}`}>
                                  <p className="flex items-center gap-2"><Phone size={14} /> {req.hospital?.phone || "Phone not provided"}</p>
                                  <p className="flex items-center gap-2"><MapPin size={14} /> Proceed immediately to main entrance.</p>
                                </div>
                              </div>

                              {/* Navigation Details */}
                              {(() => {
                                const hLat = req.location?.coordinates[1] || req.hospital?.location?.coordinates[1];
                                const hLng = req.location?.coordinates[0] || req.hospital?.location?.coordinates[0];
                                const dist = getDistance(data.location.coordinates[1], data.location.coordinates[0], hLat, hLng);
                                const eta = dist ? Math.ceil((dist / 40) * 60) : null; // roughly 40km/h avg speed

                                return dist ? (
                                  <div className="flex items-center gap-4 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-emerald-600 uppercase">Distance</p>
                                      <p className="font-bold text-emerald-700">{dist.toFixed(1)} km</p>
                                    </div>
                                    <div className="h-8 w-px bg-emerald-500/20" />
                                    <div className="text-center">
                                      <p className="text-xs font-semibold text-amber-600 uppercase">Est. Time</p>
                                      <p className="font-bold text-amber-700">{eta} mins</p>
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>

                            {/* Action Bar */}
                            <div className={`bg-emerald-50 p-4 border-b border-emerald-100 flex gap-3 ${darkMode ? '!bg-zinc-800/50 !border-zinc-700/50' : ''}`}>
                              {req.hospital?.phone && (
                                <a href={`tel:${req.hospital.phone}`} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
                                  <Phone size={18} /> Call Hospital
                                </a>
                              )}
                              <a href={`https://www.google.com/maps/dir/?api=1&destination=${req.location?.coordinates[1] || req.hospital?.location?.coordinates[1]},${req.location?.coordinates[0] || req.hospital?.location?.coordinates[0]}`} target="_blank" rel="noreferrer" className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
                                <Navigation size={18} /> Start Navigation
                              </a>
                            </div>

                            {/* Map Routing View */}
                            {(() => {
                              const hLat = req.location?.coordinates[1] || req.hospital?.location?.coordinates[1];
                              const hLng = req.location?.coordinates[0] || req.hospital?.location?.coordinates[0];
                              if (!hLat || !hLng) return null;

                              return (
                                <div className="h-64 sm:h-80 w-full relative z-0">
                                  <MapView
                                    darkMode={darkMode}
                                    center={[data.location.coordinates[1], data.location.coordinates[0]]}
                                    donors={[]}
                                    searchPerformed={true}
                                    radius={0}
                                    route={
                                      [data.location.coordinates[1], data.location.coordinates[0]] && [hLat, hLng]
                                        ? [
                                          [data.location.coordinates[1], data.location.coordinates[0]],
                                          [hLat, hLng]
                                        ]
                                        : null
                                    }
                                    routeColor="#10b981"
                                  />
                                  {/* Overlay hospital marker specifically over map */}
                                </div>
                              )
                            })()}

                          </motion.div>
                        )
                      }
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Availability Toggle - Main Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`relative overflow-hidden rounded-2xl ${data?.isAvailable
                ? 'bg-gradient-to-br from-red-500 to-rose-600'
                : `${theme.cardBg} border ${theme.cardBorder}`
                }`}
            >
              {/* Background Pattern */}
              {data?.isAvailable && (
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }} />
                </div>
              )}

              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data?.isAvailable ? 'bg-white/20' : theme.inputBg
                      }`}>
                      {data?.isAvailable ? (
                        <Radio size={24} className="text-white" />
                      ) : (
                        <WifiOff size={24} className={theme.textMuted} />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${data?.isAvailable ? 'text-white' : theme.text}`}>
                        {data?.isAvailable ? 'You are Visible' : 'You are Hidden'}
                      </h3>
                      <p className={`text-sm ${data?.isAvailable ? 'text-white/70' : theme.textMuted}`}>
                        {data?.isAvailable
                          ? 'Clinics within 10km can see your profile and contact you for donations.'
                          : 'Toggle on to make yourself visible to nearby medical facilities.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleAvailability}
                    disabled={isToggling}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 whitespace-nowrap ${data?.isAvailable
                      ? 'bg-white text-red-600 hover:bg-red-50'
                      : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                  >
                    {isToggling ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : data?.isAvailable ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                    {isToggling ? 'Updating...' : data?.isAvailable ? 'Go Invisible' : 'Go Online'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} flex items-center justify-center`}>
                    <MapPin size={20} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${theme.text}`}>Your Location</h3>
                    <p className={`text-sm ${theme.textSubtle}`}>Used to find nearby clinics</p>
                  </div>
                </div>

                {hasLocation && (
                  <div className="flex items-center gap-1.5 text-emerald-500 text-sm">
                    <CheckCircle2 size={14} />
                    <span className="font-medium">Synced</span>
                  </div>
                )}
              </div>

              {/* Coordinates Display */}
              <div className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-5 mb-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs ${theme.textSubtle} mb-1 uppercase tracking-wide`}>Coordinates</p>
                    <p className={`font-mono text-lg font-semibold ${hasLocation ? theme.text : theme.textSubtle}`}>
                      {hasLocation
                        ? `${data.location.coordinates[1].toFixed(4)}°N, ${data.location.coordinates[0].toFixed(4)}°E`
                        : 'Not set'}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasLocation
                    ? 'bg-emerald-500/10'
                    : darkMode ? 'bg-zinc-800' : 'bg-gray-100'
                    }`}>
                    {hasLocation ? (
                      <Navigation size={20} className="text-emerald-500" />
                    ) : (
                      <AlertCircle size={20} className={theme.textSubtle} />
                    )}
                  </div>
                </div>
              </div>

              {/* Sync Button */}
              <button
                onClick={handleUpdateLocation}
                disabled={isSyncing}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-sm transition-all disabled:opacity-50 ${darkMode
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                {isSyncing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Fetching location...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    <span>{hasLocation ? 'Update Location' : 'Sync Location'}</span>
                  </>
                )}
              </button>

              {/* Sync Success Message */}
              <AnimatePresence>
                {syncSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 mt-4 text-emerald-500 text-sm"
                  >
                    <CheckCircle2 size={16} />
                    <span>Location updated successfully</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Donation History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-6 mb-4`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-red-500/10' : 'bg-red-50'} flex items-center justify-center`}>
                  <Droplet size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme.text}`}>Donation History</h3>
                  <p className={`text-sm ${theme.textSubtle}`}>Your past contributions</p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className={`text-center p-6 rounded-xl border border-dashed ${theme.cardBorder}`}>
                  <p className={`text-sm ${theme.textMuted}`}>No completed donations yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((req) => (
                    <div key={req._id} className={`${theme.inputBg} border ${theme.cardBorder} rounded-xl p-4 flex justify-between items-center`}>
                      <div>
                        <p className={`font-semibold ${theme.text}`}>{req.hospital?.name || "Verified Hospital"}</p>
                        <p className={`text-xs ${theme.textMuted} mt-1 flex items-center gap-1.5`}>
                          <Clock size={12} />
                          {new Date(req.completedAt).toLocaleDateString()} at {new Date(req.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="bg-red-500/10 text-red-500 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {req.unitsRequired} Unit(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Privacy Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'} flex items-center justify-center flex-shrink-0`}>
                    <Lock size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme.text} mb-1`}>Privacy Protected</h4>
                    <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                      Your contact info is only shared with verified medical facilities when you're online.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Network Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl p-5`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-violet-500/10' : 'bg-violet-50'} flex items-center justify-center flex-shrink-0`}>
                    <Globe size={18} className="text-violet-500" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme.text} mb-1`}>Local Network</h4>
                    <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                      Connected to hospitals and clinics within a 10km radius of your location.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activity Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className={`${darkMode ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'} border rounded-2xl p-5`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'} flex items-center justify-center`}>
                    <Zap size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${theme.text}`}>Stay Active</h4>
                    <p className={`text-sm ${theme.textMuted}`}>Keep your location updated for accurate matching</p>
                  </div>
                </div>
                <ChevronRight size={20} className={theme.textSubtle} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`text-center mt-12 pb-8`}
        >
          <p className={`text-sm ${theme.textSubtle}`}>
            Thank you for being a donor. Your contribution saves lives. 💚
          </p>
        </motion.div>
      </div>
    </div >
  );
};

export default DonorDashboard;