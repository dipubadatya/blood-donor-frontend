import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { searchDonors, getDonorStats } from "../services/api";
import Navbar from "../components/Navbar";
import DonorCard from "../components/DonorCard";
import MapView from "../components/MapView";
import { Search, MapPin, Activity, Users, Filter, Navigation, RefreshCw, X, Heart } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const MedicalDashboard = () => {
  const { user } = useAuth();
  const [bloodGroup, setBloodGroup] = useState("");
  const [distance, setDistance] = useState(5000);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [donors, setDonors] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searching, setSearching] = useState(false);
  const [stats, setStats] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ─── Logic: Fetch Stats ───
  const fetchStats = useCallback(async () => {
    try {
      const res = await getDonorStats();
      setStats(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ─── Logic: Auto-detect Location from User Profile ───
  useEffect(() => {
    if (user?.location?.coordinates) {
      const [lng, lat] = user.location.coordinates;
      if (lng !== 0) { setLongitude(lng.toString()); setLatitude(lat.toString()); }
    }
  }, [user]);

  // ─── Logic: GPS Detection ───
  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { enableHighAccuracy: true }
    );
  };

  // ─── Logic: Search Donors ───
  const handleSearch = async () => {
    if (!bloodGroup) return setErrorMessage("Select a blood group first.");
    setErrorMessage("");
    try {
      setSearching(true);
      const res = await searchDonors({ 
        bloodGroup, 
        longitude: parseFloat(longitude), 
        latitude: parseFloat(latitude), 
        distance 
      });
      setDonors(res.data.donors || []);
      setSearchPerformed(true);
    } catch (err) {
      setErrorMessage("Network error during search.");
    } finally {
      setSearching(false);
    }
  };

  const mapCenter = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : [20.2961, 85.8245];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* 1. Header Area */}
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">Medical Console</h1>
          <p className="text-slate-500 font-medium">Monitoring donor network in real-time.</p>
        </header>

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatBox icon={<Users size={20}/>} label="Total Donors" value={stats?.totalDonors || 0} color="text-slate-900" />
          <StatBox icon={<Activity size={20}/>} label="Available Donors" value={stats?.totalAvailable || 0} color="text-green-600" />
          {/* Example breakdown shown in stats */}
          {/* {stats?.bloodGroupBreakdown?.slice(0, 2).map(bg => (
            <StatBox key={bg.bloodGroup} icon={<Heart size={18}/>} label={`${bg.bloodGroup} Available`} value={bg.available} color="text-red-600" />
          ))} */}
        </div>

        {/* 3. Search Panel (Your original structure) */}
        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 mb-10 shadow-sm">
          <div className="flex items-center gap-2 mb-8 text-slate-400">
            <Filter size={18} />
            <h2 className="text-xs font-black uppercase tracking-widest">Search Parameters</h2>
          </div>

          {errorMessage && <p className="text-red-600 text-xs font-bold mb-4">⚠️ {errorMessage}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Blood Group Selection */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Target Group</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map(bg => (
                  <button 
                    key={bg} 
                    onClick={() => setBloodGroup(bg)} 
                    className={`py-2.5 rounded-xl text-xs font-black transition-all ${bloodGroup === bg ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Slider */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 flex justify-between">
                Radius <span>{(distance/1000).toFixed(1)} km</span>
              </label>
              <input 
                type="range" min="1000" max="10000" step="1000" value={distance} 
                onChange={(e) => setDistance(e.target.value)} 
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-600" 
              />
              <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                <span>1km</span><span>10km</span>
              </div>
            </div>

            {/* Location Input */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Center Point</label>
                <button onClick={detectLocation} className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1">
                  <Navigation size={10} /> {geoLoading ? "Locating..." : "Auto Detect"}
                </button>
              </div>
              <div className="flex gap-3">
                <input type="text" placeholder="Lat" value={latitude} readOnly className="w-1/2 bg-slate-50 border-none p-3 rounded-xl text-xs font-bold text-slate-500" />
                <input type="text" placeholder="Long" value={longitude} readOnly className="w-1/2 bg-slate-50 border-none p-3 rounded-xl text-xs font-bold text-slate-500" />
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-4">
            <button onClick={handleSearch} disabled={searching} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
              {searching ? <RefreshCw className="animate-spin" size={16}/> : <Search size={16}/>}
              {searching ? "Searching Database..." : "Locate Nearby Donors"}
            </button>
            {searchPerformed && (
              <button onClick={() => { setDonors([]); setSearchPerformed(false); }} className="px-6 bg-slate-100 text-slate-400 rounded-2xl hover:text-red-600 transition-colors">
                <X size={20} />
              </button>
            )}
          </div>
        </section>

        {/* 4. Results Section: Map followed by List */}
        <div className="space-y-10">
          <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl h-[500px]">
             <MapView center={mapCenter} donors={donors} radius={distance} searchPerformed={searchPerformed} />
          </div>

          {searchPerformed && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Results ({donors.length})</h2>
                  <div className="h-px bg-slate-100 flex-1 mx-6 hidden sm:block"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map(donor => (
                    <DonorCard key={donor._id} donor={donor} />
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Internal Component for Stats
const StatBox = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 bg-slate-50 rounded-2xl ${color}`}> {icon} </div>
    <div>
      <p className={`text-2xl font-black leading-none ${color}`}>{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{label}</p>
    </div>
  </div>
);

export default MedicalDashboard;