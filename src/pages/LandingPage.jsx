

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Map, Shield, ArrowUpRight, Github, HeartPulse } from 'lucide-react';
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] selection:bg-red-50 selection:text-red-600 font-sans">

      {/* Subtle Top Progress Bar Decor */}
      <div className="h-1.5 w-full bg-slate-100 fixed top-0 z-[60]">
        <div className="h-full w-1/3 bg-red-500 rounded-r-full"></div>
      </div>

      {/* Modern Slim Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
            {/* <Heart className="text-white fill-white" size={20} /> */}
            <HeartPulse className="text-white " size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">LifeLink</span>
        </div>

        <div className="flex items-center gap-6">
          {/* <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors">Sign In</Link> */}
          <Link to="/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200">
            Join the Network
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Side Project •  2026</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Blood tracking <br />
              <span className="text-red-600 italic">reimagined.</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium mb-10">
              A minimalist bridge between voluntary donors and medical clinics.
              Real-time mapping. Zero friction. Pure impact.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="group bg-red-600 text-white px-8 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-red-700 transition-all shadow-2xl shadow-red-100">
                Register as Donor
                <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-5 rounded-2xl font-bold border-2 border-slate-100 hover:bg-slate-50 transition-colors">
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] border-white">
              <img
                src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=1000"
                alt="Medical App"
                className="w-full h-[500px] object-cover"
              />
            </div>
            {/* Aesthetic Blob */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-red-100 rounded-full blur-[100px] -z-0 opacity-60"></div>
          </motion.div>
        </div>
      </header>

      {/* Bento Grid Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <Map className="text-red-500 mb-6" size={40} />
              <h3 className="text-3xl font-bold mb-4">Precision Mapping</h3>
              <p className="text-slate-400 max-w-md text-lg leading-relaxed">
                Using Leaflet.js to visualize donor availability across regions.
                Clinics can filter by blood group and proximity instantly.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>

          <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 hover:border-red-100 transition-colors">
            <Search className="text-red-600 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Smart Filter</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Proprietary search logic to find rare groups in under 2 seconds.
            </p>
          </div>

          <div className="bg-red-50 rounded-[2.5rem] p-10 border border-red-100">
            <Shield className="text-red-600 mb-6" size={40} />
            <h3 className="text-2xl font-bold mb-4">Secure & Verified</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Medical-grade security for donor privacy and clinic authentication.
            </p>
          </div>

          <div className="md:col-span-2 bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div>
              <h3 className="text-3xl font-bold mb-2 text-slate-900">Open Source</h3>
              {/* <p className="text-slate-500 font-medium">Built as a final year initiative for community welfare.</p> */}
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/dipubadatya/blood-donor-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors inline-flex items-center justify-center"
              >
                <Github size={24} />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 font-medium text-sm">© 2026 LifeLink Project. Designed for Impact.</p>
        <div className="flex gap-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">React</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Tailwind</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">MERN Stack</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;