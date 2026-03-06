
//  LandingPage;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Shield,
  ArrowRight,
  Github,
  HeartPulse,
  Clock,
  Droplet,
  Mail,
  Zap,
  ChevronRight,
  Terminal,
  Fingerprint,
  Radio,
  Filter,
  Bell,
  Users,
  Building2,
  Moon,
  Sun,
  ExternalLink,
  Copy,
  Check,
  Workflow,
  GitBranch,
  Star,
  Coffee
} from 'lucide-react';
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('git clone https://github.com/dipubadatya/blood-donor-backend.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const theme = {
    bg: darkMode ? 'bg-[#09090B]' : 'bg-[#FAFAFA]',
    text: darkMode ? 'text-white' : 'text-zinc-900',
    textMuted: darkMode ? 'text-zinc-400' : 'text-zinc-600',
    textSubtle: darkMode ? 'text-zinc-500' : 'text-zinc-500',
    border: darkMode ? 'border-zinc-800' : 'border-zinc-200',
    cardBg: darkMode ? 'bg-zinc-900/50' : 'bg-white',
    cardBorder: darkMode ? 'border-zinc-800/50' : 'border-zinc-200',
    hoverBg: darkMode ? 'hover:bg-zinc-800/50' : 'hover:bg-zinc-100',
    codeBg: darkMode ? 'bg-zinc-950' : 'bg-zinc-100',
  };

  const bloodGroups = [
    { type: 'A+', urgency: 'stable', donors: 847 },
    { type: 'O-', urgency: 'critical', donors: 123 },
    { type: 'B+', urgency: 'stable', donors: 654 },
    { type: 'AB-', urgency: 'low', donors: 89 },
  ];

  const workflowSteps = [
    { 
      id: '01', 
      title: 'Donor Registration', 
      desc: 'Blood type, location, contact info',
      icon: Fingerprint,
      color: 'text-emerald-500',
      bgColor: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
    },
    { 
      id: '02', 
      title: 'Availability Toggle', 
      desc: 'Donors mark when they can help',
      icon: Radio,
      color: 'text-amber-500',
      bgColor: darkMode ? 'bg-amber-500/10' : 'bg-amber-50'
    },
    { 
      id: '03', 
      title: 'Smart Matching', 
      desc: 'Filter by group, distance, status',
      icon: Filter,
      color: 'text-violet-500',
      bgColor: darkMode ? 'bg-violet-500/10' : 'bg-violet-50'
    },
    { 
      id: '04', 
      title: 'Instant Contact', 
      desc: 'Secure communication channel',
      icon: Bell,
      color: 'text-rose-500',
      bgColor: darkMode ? 'bg-rose-500/10' : 'bg-rose-50'
    },
  ];

  const techDetails = [
    { label: 'Frontend', value: 'React 18 + Vite', note: 'with lazy loading' },
    { label: 'Styling', value: 'Tailwind CSS', note: 'custom design system' },
    { label: 'Backend', value: 'Node.js + Express', note: 'REST API' },
    { label: 'Database', value: 'MongoDB Atlas', note: 'with indexing' },
    { label: 'Maps', value: 'Leaflet.js', note: 'OpenStreetMap tiles' },
    { label: 'Auth', value: 'JWT + bcrypt', note: 'secure sessions' },
  ];

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} transition-colors duration-300`}>
      
      {/* Ambient Background */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-rose-500/[0.02] rounded-full blur-[120px]" />
        </div>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 ${theme.bg}/80 backdrop-blur-xl border-b ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 bg-red-500 rounded-lg blur-lg opacity-40" />
                <div className="relative w-9 h-9 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                  <HeartPulse size={18} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <span className="font-semibold tracking-tight text-lg">lifelink</span>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${darkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'}`}>
                v0.1
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl ${theme.hoverBg} transition-colors`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} className="text-zinc-400" /> : <Moon size={18} className="text-zinc-600" />}
              </button>

              {/* GitHub */}
              <a
                href="https://github.com/dipubadatya/blood-donor-backend"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${theme.hoverBg} transition-colors ${theme.textMuted}`}
              >
                <Github size={18} />
                <span className="text-sm font-medium">Source</span>
              </a>

              {/* CTA */}
              <Link
                to="/register"
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${darkMode ? 'bg-zinc-800/50' : 'bg-zinc-100'} border ${theme.cardBorder}`}>
              <span className="flex items-center gap-1.5">
                <Coffee size={14} className="text-amber-500" />
                <span className={`text-sm ${theme.textMuted}`}>Side project</span>
              </span>
              <span className={`w-1 h-1 rounded-full ${darkMode ? 'bg-zinc-600' : 'bg-zinc-400'}`} />
              <span className={`text-sm ${theme.textMuted}`}>Built for learning</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className={darkMode ? 'text-zinc-100' : 'text-zinc-900'}>Find blood donors</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400">
                when it matters most
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-center text-lg sm:text-xl ${theme.textMuted} max-w-2xl mx-auto mb-12 leading-relaxed`}
          >
            An open-source platform that connects voluntary blood donors with hospitals and clinics. 
            Real-time availability. Location-based search. Zero hassle.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-medium text-lg transition-all shadow-lg shadow-red-500/20"
            >
              <Droplet size={20} />
              <span>Register as Donor</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a
              href="#how-it-works"
              className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-medium text-lg border-2 ${theme.border} ${theme.hoverBg} transition-colors`}
            >
              <Workflow size={20} className={theme.textMuted} />
              <span>How it works</span>
            </a>
          </motion.div>

          {/* Live Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-50" />
            
            {/* Card */}
            <div className={`relative ${theme.cardBg} border ${theme.cardBorder} rounded-2xl overflow-hidden backdrop-blur-sm`}>
              
              {/* Card Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${theme.border}`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className={`text-sm ${theme.textSubtle}`}>Dashboard Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-emerald-500 text-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {/* Search Bar Mock */}
                <div className={`flex items-center gap-3 p-4 rounded-xl ${theme.codeBg} border ${theme.border} mb-6`}>
                  <MapPin size={20} className="text-red-500" />
                  <span className={theme.textMuted}>Search donors near</span>
                  <span className={`px-2 py-1 rounded-md ${darkMode ? 'bg-zinc-800' : 'bg-zinc-200'} ${theme.text} text-sm font-medium`}>
                    Mumbai, India
                  </span>
                  <div className="flex-1" />
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme.textSubtle}`}>Blood Group:</span>
                    <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-sm font-semibold">
                      O-
                    </span>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {bloodGroups.map((group, idx) => (
                    <motion.div
                      key={group.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className={`relative p-4 rounded-xl ${theme.codeBg} border ${theme.border} group hover:border-red-500/30 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-2xl font-bold ${theme.text}`}>{group.type}</span>
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                          ${group.urgency === 'critical' 
                            ? 'bg-red-500/10 text-red-500' 
                            : group.urgency === 'low' 
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-emerald-500/10 text-emerald-500'
                          }
                        `}>
                          {group.urgency}
                        </span>
                      </div>
                      <p className={`text-sm ${theme.textMuted}`}>
                        <span className="font-semibold">{group.donors}</span> available
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-2 mb-4">
              <Workflow size={18} className="text-red-500" />
              <span className={`text-sm font-medium ${theme.textMuted}`}>How It Works</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              Simple workflow, <br />
              <span className={theme.textMuted}>maximum impact</span>
            </h2>
            <p className={`text-lg ${theme.textMuted}`}>
              Four steps to connect donors with those in need. 
              No bureaucracy, no delays.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} group hover:border-zinc-700 transition-colors`}
              >
                {/* Step Number */}
                <span className={`absolute top-6 right-6 text-4xl font-bold ${darkMode ? 'text-zinc-800' : 'text-zinc-200'}`}>
                  {step.id}
                </span>
                
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                  <step.icon size={22} className={step.color} />
                </div>
                
                {/* Content */}
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${theme.textMuted}`}>
                  {step.desc}
                </p>

                {/* Connector */}
                {idx < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform translate-x-1/2">
                    <ChevronRight size={16} className={theme.textSubtle} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two User Types */}
      <section className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* For Donors */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} overflow-hidden group`}
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Users size={22} className="text-red-500" />
                </div>
                <div>
                  <h3 className={`font-semibold text-xl ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    For Donors
                  </h3>
                  <p className={`text-sm ${theme.textMuted}`}>Individuals who want to help</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Create your donor profile in 2 minutes',
                  'Specify your blood type and location',
                  'Toggle availability on/off anytime',
                  'Get notified when nearby clinics need you',
                  'Track your donation history'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <span className={theme.textMuted}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-red-500 font-medium hover:text-red-400 transition-colors group/link"
              >
                <span>Register as donor</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* For Clinics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} overflow-hidden group`}
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Building2 size={22} className="text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-semibold text-xl ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    For Clinics
                  </h3>
                  <p className={`text-sm ${theme.textMuted}`}>Hospitals & medical facilities</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Search donors by blood group instantly',
                  'Filter by distance radius from your location',
                  'View real-time availability status',
                  'Secure contact system for privacy',
                  'Manage urgent blood requests'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className={theme.textMuted}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register?type=clinic"
                className="inline-flex items-center gap-2 text-blue-500 font-medium hover:text-blue-400 transition-colors group/link"
              >
                <span>Register your clinic</span>
                <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap size={18} className="text-amber-500" />
              <span className={`text-sm font-medium ${theme.textMuted}`}>Features</span>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              What's under the hood
            </h2>
            <p className={`text-lg ${theme.textMuted}`}>
              Built with modern tools for a smooth experience
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: MapPin,
                title: 'Interactive Maps',
                desc: 'Leaflet.js integration with OpenStreetMap. Visualize donors geographically with custom markers.',
                color: 'text-emerald-500',
                bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
              },
              {
                icon: Filter,
                title: 'Smart Filtering',
                desc: 'Query donors by blood group, availability, and proximity. Results update in real-time.',
                color: 'text-violet-500',
                bg: darkMode ? 'bg-violet-500/10' : 'bg-violet-50'
              },
              {
                icon: Shield,
                title: 'Privacy First',
                desc: 'JWT authentication, bcrypt hashing. Donor info only visible to verified clinics.',
                color: 'text-amber-500',
                bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50'
              },
              {
                icon: Clock,
                title: 'Real-time Status',
                desc: 'Donors toggle availability instantly. No stale data, no wasted calls.',
                color: 'text-rose-500',
                bg: darkMode ? 'bg-rose-500/10' : 'bg-rose-50'
              },
              {
                icon: Bell,
                title: 'Notifications',
                desc: 'Alert system for urgent requests. Donors get notified when their group is needed.',
                color: 'text-blue-500',
                bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
              },
              {
                icon: Fingerprint,
                title: 'Verified Profiles',
                desc: 'Medical facilities are verified. Donors can trust who contacts them.',
                color: 'text-cyan-500',
                bg: darkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder} hover:border-zinc-700 transition-colors`}
              >
                <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <feature.icon size={20} className={feature.color} />
                </div>
                <h3 className={`font-semibold text-lg mb-2 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={18} className="text-green-500" />
                <span className={`text-sm font-medium ${theme.textMuted}`}>Tech Stack</span>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Open source, <br />
                <span className={theme.textMuted}>fully documented</span>
              </h2>
              <p className={`text-lg ${theme.textMuted} mb-8`}>
                This is a learning project, built to explore the MERN stack. 
                Feel free to clone, fork, or contribute. Feedback welcome!
              </p>

              {/* Clone Command */}
              <div className={`p-4 rounded-xl ${theme.codeBg} border ${theme.border} mb-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs ${theme.textSubtle} uppercase tracking-wide`}>Clone Repository</span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs ${theme.textMuted} hover:text-white transition-colors`}
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <code className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'} font-mono`}>
                  git clone https://github.com/dipubadatya/blood-donor-backend.git
                </code>
              </div>

              {/* GitHub Link */}
              <a
                href="https://github.com/dipubadatya/blood-donor-backend"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl ${theme.cardBg} border ${theme.cardBorder} hover:border-zinc-600 transition-colors group`}
              >
                <Github size={20} className={theme.textMuted} />
                <div className="text-left">
                  <p className={`font-medium ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>View on GitHub</p>
                  <p className={`text-sm ${theme.textSubtle}`}>Star ⭐ if you find it useful</p>
                </div>
                <ExternalLink size={16} className={`${theme.textSubtle} group-hover:text-zinc-400 transition-colors ml-2`} />
              </a>
            </div>

            {/* Right - Tech Details */}
            <div className={`p-6 rounded-2xl ${theme.cardBg} border ${theme.cardBorder}`}>
              <div className="grid gap-4">
                {techDetails.map((tech, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between py-3 ${idx !== techDetails.length - 1 ? `border-b ${theme.border}` : ''}`}
                  >
                    <span className={`text-sm ${theme.textSubtle}`}>{tech.label}</span>
                    <div className="text-right">
                      <span className={`font-medium ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{tech.value}</span>
                      <span className={`text-sm ${theme.textSubtle} ml-2`}>({tech.note})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Background */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-rose-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
             */}
            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                <Droplet size={28} className="text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to try it out?
              </h2>
              
              <p className="text-lg text-white/80 max-w-lg mx-auto mb-8">
                This project is live and functional. Create an account to explore the full experience.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                >
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href="https://github.com/dipubadatya/blood-donor-backend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  <Github size={18} />
                  <span>View Code</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${theme.border}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                <HeartPulse size={16} className="text-white" />
              </div>
              <div>
                <span className={`font-medium ${darkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>lifelink</span>
                <span className={`text-sm ${theme.textSubtle} ml-2`}>· Open source project</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/dipubadatya/blood-donor-backend"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${theme.textMuted} hover:text-red-500 transition-colors`}
              >
                <Github size={18} />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href="mailto:contact@example.com"
                className={`flex items-center gap-2 ${theme.textMuted} hover:text-red-500 transition-colors`}
              >
                <Mail size={18} />
                <span className="text-sm">Contact</span>
              </a>
            </div>
          </div>

          {/* Bottom */}
          <div className={`mt-8 pt-8 border-t ${theme.border} flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <p className={`text-sm ${theme.textSubtle}`}>
              Built with React, Node.js, MongoDB, and Tailwind CSS
            </p>
            <p className={`text-sm ${theme.textSubtle}`}>
              © 2024 · Made with ☕ and curiosity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;