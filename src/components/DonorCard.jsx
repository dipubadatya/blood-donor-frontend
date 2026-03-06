

// components/DonorCard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Star
} from "lucide-react";

const DonorCard = ({ donor, index, darkMode, theme, viewMode = "grid" }) => {
  const {
    name,
    email,
    phone,
    bloodGroup,
    isAvailable,
    distanceInMeters,
    distanceInKm,
    location,
    reliabilityScore,
    eligibilityStatus
  } = donor;

  const formatDistance = () => {
    if (distanceInKm !== undefined) {
      return distanceInKm < 1 ? `${distanceInMeters}m` : `${distanceInKm.toFixed(1)}km`;
    }
    return "—";
  };

  const getUrgencyConfig = () => {
    if (distanceInMeters <= 1000) {
      return {
        color: 'emerald',
        label: 'Very Close',
        bgClass: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50',
        textClass: 'text-emerald-500',
        borderClass: 'border-emerald-500/20'
      };
    }
    if (distanceInMeters <= 3000) {
      return {
        color: 'amber',
        label: 'Nearby',
        bgClass: darkMode ? 'bg-amber-500/10' : 'bg-amber-50',
        textClass: 'text-amber-500',
        borderClass: 'border-amber-500/20'
      };
    }
    return {
      color: 'red',
      label: 'Far',
      bgClass: darkMode ? 'bg-red-500/10' : 'bg-red-50',
      textClass: 'text-red-500',
      borderClass: 'border-red-500/20'
    };
  };

  const urgency = getUrgencyConfig();

  const googleMapsUrl = location?.coordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[1]},${location.coordinates[0]}`
    : '#';

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`${theme.cardBg} border ${theme.cardBorder} rounded-xl p-4 hover:border-red-500/30 transition-all`}
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {name?.charAt(0).toUpperCase()}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${theme.text} truncate`}>{name}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white`}>
                {bloodGroup}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                <MapPin size={12} />
                {formatDistance()}
              </span>
              <span className={`flex items-center gap-1 ${isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
                {isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="p-2.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Phone size={16} />
              </a>
            )}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-xl ${theme.inputBg} border ${theme.cardBorder} ${theme.textMuted} hover:text-red-500 hover:border-red-500/50 transition-all`}
            >
              <Navigation size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={`${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden hover:border-red-500/30 transition-all group`}
    >
      {/* Top Accent Bar */}
      <div className={`h-1 w-full ${urgency.color === 'emerald' ? 'bg-emerald-500' :
        urgency.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
        }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-lg">
                {name?.charAt(0).toUpperCase()}
              </div>
              {isAvailable && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#141415]" />
              )}
            </div>

            <div>
              <h3 className={`font-semibold ${theme.text}`}>{name}</h3>
              <p className={`text-sm ${theme.textMuted}`}>Donor #{String(index + 1).padStart(3, '0')}</p>
            </div>
          </div>

          {/* Blood Group & Reliability */}
          <div className="flex flex-col items-end gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-sm">
              {bloodGroup}
            </div>
            {reliabilityScore !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${reliabilityScore >= 80 ? 'text-amber-500' : 'text-gray-500'}`}>
                <Star size={12} fill="currentColor" />
                {reliabilityScore}% Score
              </div>
            )}
            {eligibilityStatus && (
              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${eligibilityStatus === 'eligible' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {eligibilityStatus}
              </div>
            )}
          </div>
        </div>

        {/* Distance & Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${urgency.bgClass} border ${urgency.borderClass}`}>
            <MapPin size={12} className={urgency.textClass} />
            <span className={`text-xs font-semibold ${urgency.textClass}`}>{formatDistance()}</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isAvailable
            ? darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'
            : darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'
            } border`}>
            {isAvailable ? (
              <CheckCircle2 size={12} className="text-emerald-500" />
            ) : (
              <XCircle size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-semibold ${isAvailable ? 'text-emerald-500' : 'text-red-500'}`}>
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`space-y-2 p-3 rounded-xl ${theme.inputBg} border ${theme.cardBorder} mb-4`}>
          <div className="flex items-center gap-2">
            <Mail size={14} className={theme.textSubtle} />
            <span className={`text-sm ${theme.textMuted} truncate`}>{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className={theme.textSubtle} />
            <span className={`text-sm ${phone ? theme.textMuted : theme.textSubtle}`}>
              {phone || 'Not provided'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors"
            >
              <Phone size={16} />
              <span>Call</span>
            </a>
          ) : (
            <button
              disabled
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl ${theme.inputBg} ${theme.textSubtle} font-medium text-sm cursor-not-allowed`}
            >
              <Phone size={16} />
              <span>No Phone</span>
            </button>
          )}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl ${theme.inputBg} border ${theme.cardBorder} ${theme.text} font-medium text-sm hover:border-red-500/50 transition-all`}
          >
            <Navigation size={16} />
            <span>Navigate</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default DonorCard;