'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { RegisterBusinessModal } from '../modals/RegisterBusinessModal';
import {
  Globe,
  Building2,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  MapPin,
  Package,
  Wrench,
  Handshake,
  Star,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UNIVERSAL_TAXONOMY, GLOBAL_COUNTRIES } from '@/data/taxonomy';

export function LandingPage() {
  const {
    setAppMode,
    setDashboardView,
    performBusinessSearch,
    setIsRegisterModalOpen,
    switchAccountType,
    searchParams,
    setSearchParams,
  } = useBizLink();

  const [landingQuery, setLandingQuery] = useState('');
  const [landingCountry, setLandingCountry] = useState('GLOBAL');

  const handleLandingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({
      ...prev,
      query: landingQuery || '',
      location: landingCountry === 'GLOBAL' ? 'Worldwide' : landingCountry,
    }));
    setAppMode('business_owner');
    setDashboardView('find_suppliers');
    performBusinessSearch({
      query: landingQuery || '',
      location: landingCountry === 'GLOBAL' ? 'Worldwide' : landingCountry,
    });
  };

  const handleSectorClick = (industryName: string) => {
    setSearchParams(prev => ({
      ...prev,
      query: '',
      industry: industryName,
    }));
    setAppMode('business_owner');
    setDashboardView('find_suppliers');
    performBusinessSearch({
      industry: industryName,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Top Global Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppMode('landing')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/25">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">BizLink</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                  Universal Network
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">One Network. Every Business. Worldwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                switchAccountType('individual');
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Client Explorer
            </button>

            <button
              onClick={() => {
                switchAccountType('businessman');
              }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              Enterprise Portal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/30 via-cyan-500/20 to-blue-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connecting 190+ Countries & Across Every Industry</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            One Network. Every Business. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Every Industry. Worldwide.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            BizLink connects legitimate businesses, technology innovators, healthcare systems, precision manufacturers, creative studios, logistics networks, and independent specialists without industry silos or geographical boundaries.
          </p>

          {/* Universal Search Form */}
          <div className="max-w-3xl mx-auto mt-8">
            <form
              onSubmit={handleLandingSearch}
              className="bg-slate-900/90 p-2.5 rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={landingQuery}
                  onChange={e => setLandingQuery(e.target.value)}
                  placeholder="Search products, services, capabilities, or companies (e.g. IoT, Biologics, Brand Identity, CNC)..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Geography Dropdown */}
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 shrink-0 w-full sm:w-auto">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={landingCountry}
                  onChange={e => setLandingCountry(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="GLOBAL" className="bg-slate-900">🌐 Worldwide / Remote</option>
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.name} className="bg-slate-900">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Search Network</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-2xl font-black text-cyan-400">190+</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Countries & Territories</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-2xl font-black text-indigo-400">100%</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Industry-Independent</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-2xl font-black text-blue-400">P & S</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Products & Services Unified</p>
            </div>
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
              <span className="text-2xl font-black text-emerald-400">360°</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Universal Ecosystem Graph</p>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Industry Taxonomy Grid */}
      <section className="py-16 px-6 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-cyan-400">Scalable Industry Taxonomy</h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Every Sector. Connected as One.</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Explore businesses across all major economic sectors without forced categorization.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {UNIVERSAL_TAXONOMY.map(tax => (
              <div
                key={tax.id}
                onClick={() => handleSectorClick(tax.name)}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div className="text-2xl">{tax.icon}</div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {tax.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {tax.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Universal Principles Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400">Architectural Foundations</h2>
          <h3 className="text-2xl sm:text-3xl font-black text-white">How BizLink Redefines Global Networking</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Handshake className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Configurable Relationship Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect software companies to agencies, hospitals to device manufacturers, or consultants to enterprises. Professional networking is clearly decoupled from commercial contracts.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Unified Products & Services</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              A single enterprise can simultaneously offer physical hardware, SaaS licenses, and custom engineering services with distinct pricing models (hourly, retainer, per unit, or quote).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="p-3 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Global-First Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-currency support (USD, EUR, GBP, INR, JPY, AUD, SGD), international phone formatting, and local radius to global remote service coverage out of the box.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-blue-900 to-cyan-900 border border-indigo-700/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-black text-white">Ready to Join the Universal Business Network?</h3>
            <p className="text-xs sm:text-sm text-indigo-200">
              Establish your verified enterprise profile and connect with businesses across any sector worldwide.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-6 py-3 bg-white text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-xl hover:bg-slate-100 transition-all shrink-0"
          >
            Register Your Enterprise Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-6 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">BizLink Universal Business Network</p>
        <p className="mt-1">One Network. Every Business. Every Industry. Worldwide.</p>
      </footer>

      {/* Registration Modal */}
      <RegisterBusinessModal />
    </div>
  );
}
