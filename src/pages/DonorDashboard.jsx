
// export default DonorDashboard;
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  toggleAvailability as toggleAvailabilityAPI, 
  updateLocation as updateLocationAPI, 
  getUserProfile,
  updateProfile as updateProfileAPI 
} from "../services/api";
import Navbar from "../components/Navbar";
import { User, Activity, MapPin, Shield, RefreshCw, Power, Smartphone, Edit3, Check, X } from "lucide-react";

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const data = profile || user;
  const hasLocation = data?.location?.coordinates?.some(c => c !== 0);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res.data.user);
      // Initialize edit data with current profile values
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

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ─── LOGIC: SAVE PROFILE ───
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await updateProfileAPI(editData);
      setProfile(res.data.user);
      updateUser(res.data.user);
      setIsEditing(false);
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F4F7FA]">
      <RefreshCw className="animate-spin text-red-600 mb-4" size={32} />
      <p className="font-bold text-slate-400 animate-pulse uppercase tracking-widest">Syncing Secure Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
            <p className="text-slate-500 font-medium tracking-tight">
              Verified Donor: 
              {isEditing ? (
                <input 
                  className="ml-2 border-b-2 border-red-600 outline-none bg-transparent font-black text-red-600"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                />
              ) : (
                <span className="text-red-600 ml-1 font-black uppercase"> {data?.name}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${isEditing ? 'bg-green-600 text-white' : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'}`}
             >
               {isEditing ? (isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />) : <Edit3 size={14} />}
               {isEditing ? "SAVE CHANGES" : "EDIT PROFILE"}
             </button>
             {isEditing && (
               <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                 <X size={20} />
               </button>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Personal Info Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6 text-slate-400">
                <User size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest">Personal Info</h2>
              </div>
              <div className="space-y-4">
                <InfoItem 
                  label="Email Address" 
                  value={data?.email} 
                  isEditing={isEditing} 
                  name="email"
                  editValue={editData.email}
                  onChange={(v) => setEditData({...editData, email: v})}
                />
                <InfoItem 
                  label="Phone Line" 
                  value={data?.phone || "Update required"} 
                  isEditing={isEditing}
                  name="phone"
                  editValue={editData.phone}
                  onChange={(v) => setEditData({...editData, phone: v})}
                />
              </div>
            </div>

            {/* Medical Vital Card */}
            <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl group">
              <div className="flex items-center gap-3 mb-6 opacity-50">
                <Activity size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest">Medical Vital</h2>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  {isEditing ? (
                    <select 
                      className="bg-transparent border-b-2 border-red-500 text-2xl font-black text-red-500 outline-none"
                      value={editData.bloodGroup}
                      onChange={(e) => setEditData({...editData, bloodGroup: e.target.value})}
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg} className="bg-slate-900 text-white">{bg}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-4xl font-black tracking-tighter text-red-500">{data?.bloodGroup}</p>
                  )}
                  <p className="text-[10px] font-bold opacity-50 uppercase mt-1">Confirmed Group</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <DropletIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns (GPS & Privacy) - Unchanged but synced */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center gap-3 mb-6 text-slate-400">
                <MapPin size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest">GPS Position</h2>
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-6 mb-6 text-center border border-dashed border-slate-200">
                <p className="text-xl font-mono font-black text-slate-800 tracking-tight">
                  {hasLocation ? `${data.location.coordinates[1].toFixed(4)}°, ${data.location.coordinates[0].toFixed(4)}°` : "0.0000, 0.0000"}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Current Location</p>
              </div>
              <button 
                onClick={handleUpdateLocation}
                disabled={isSyncing}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} /> 
                {isSyncing ? "LOCKING SIGNAL..." : "SYNC POSITION"}
              </button>
            </div>

            <div className={`p-8 rounded-[2rem] shadow-sm border transition-all duration-500 flex flex-col ${data?.isAvailable ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-3 mb-6 text-slate-400">
                <Shield size={20} />
                <h2 className="text-xs font-black uppercase tracking-widest">Privacy Network</h2>
              </div>
              <p className="text-sm font-medium text-slate-600 mb-8 flex-1 leading-relaxed">
                When active, your location is broadcasted to verified medical facilities within 10km.
              </p>
              <button 
                onClick={handleToggleAvailability}
                disabled={isToggling}
                className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50 ${data?.isAvailable ? 'bg-red-600 text-white shadow-red-200 hover:bg-red-700' : 'bg-slate-100 text-slate-600 shadow-slate-100 hover:bg-slate-200'}`}
              >
                <Power size={16} className={isToggling ? "animate-pulse" : ""} /> 
                {isToggling ? "SYNCING..." : data?.isAvailable ? "GO INVISIBLE" : "APPEAR ONLINE"}
              </button>
            </div>

            <div className="md:col-span-2 bg-blue-600 p-6 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/20 rounded-xl"><Smartphone size={24} /></div>
                 <div>
                   <h4 className="font-bold">Mobile Optimization Active</h4>
                   <p className="text-xs opacity-70 font-medium">Your location is being tracked via browser GPS.</p>
                 </div>
               </div>
               <button 
                 onClick={() => window.location.reload()}
                 className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-blue-50 transition-colors"
               >
                 Refresh Feed
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modified InfoItem to support editing
const InfoItem = ({ label, value, isEditing, editValue, onChange }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</p>
    {isEditing ? (
      <input 
        className="w-full text-sm font-bold text-slate-800 mt-0.5 border-b border-slate-200 focus:border-red-600 outline-none py-1 bg-transparent"
        value={editValue}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
    )}
  </div>
);

const DropletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z"/></svg>
);

export default DonorDashboard;