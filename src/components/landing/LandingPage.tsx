'use client';

import React, { useState, useEffect } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { RegisterBusinessModal } from '../modals/RegisterBusinessModal';
import {
  Globe,
  ArrowRight,
  Zap,
  Layers,
  ShieldCheck,
  Search,
  Sparkles,
  Package,
  Handshake,
  ChevronRight,
  Building2,
  Lock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { UNIVERSAL_TAXONOMY, GLOBAL_COUNTRIES } from '@/data/taxonomy';

const ROTATING_INDUSTRIES = [
  'Technology & AI',
  'Healthcare & Biotech',
  'Manufacturing',
  'Creative & Media',
  'Finance & Legal',
  'Logistics & Supply',
  'Architecture',
  'Agriculture',
  'Education',
  'Energy',
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Verified Network', color: 'text-emerald-400' },
  { icon: Globe, label: '190+ Countries', color: 'text-cyan-400' },
  { icon: Zap, label: 'Real-time Discovery', color: 'text-amber-400' },
  { icon: Lock, label: 'Enterprise Grade', color: 'text-violet-400' },
];

const FEATURE_GRID = [
  {
    icon: Handshake,
    title: 'Configurable Relationship Engine',
    desc: 'Connect software companies to agencies, hospitals to device suppliers, or freelancers to enterprises. Eleven distinct relationship types — none forced.',
    accent: '#6366f1',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: Package,
    title: 'Unified Products & Services',
    desc: 'A single enterprise can offer physical hardware, SaaS licenses, and custom engineering services simultaneously — with distinct pricing models.',
    accent: '#22d3ee',
    glow: 'rgba(34,211,238,0.12)',
  },
  {
    icon: Globe,
    title: 'Global-First Architecture',
    desc: 'Multi-currency (USD, EUR, GBP, JPY, INR, AUD, SGD, AED), international phone formatting, and local radius to global remote service coverage.',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.12)',
  },
  {
    icon: Layers,
    title: 'Scalable Industry Taxonomy',
    desc: 'Fourteen primary sectors with unlimited subcategories. No hardcoded assumptions. Add any new industry without touching the database architecture.',
    accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.12)',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Credential Layer',
    desc: 'Verified business profiles, credential portfolios, reputation scores, and transparent commercial track records across all sectors.',
    accent: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
  },
  {
    icon: TrendingUp,
    title: 'Cross-Sector Discovery',
    desc: 'Find partners by capability, not just category. Discovery works equally for a local repair shop and a Fortune 500 logistics company.',
    accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
  },
];

export function LandingPage() {
  const {
    setAppMode,
    setDashboardView,
    performBusinessSearch,
    setIsRegisterModalOpen,
    switchAccountType,
    setSearchParams,
  } = useBizLink();

  const [landingQuery, setLandingQuery] = useState('');
  const [landingCountry, setLandingCountry] = useState('GLOBAL');
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setRotatingIdx(i => (i + 1) % ROTATING_INDUSTRIES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const handleLandingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({
      ...prev,
      query: landingQuery || '',
      location: landingCountry === 'GLOBAL' ? 'Worldwide' : landingCountry,
    }));
    setAppMode('business_owner');
    setDashboardView('find_suppliers');
    performBusinessSearch({ query: landingQuery || '', location: landingCountry === 'GLOBAL' ? 'Worldwide' : landingCountry });
  };

  const handleSectorClick = (industryName: string) => {
    setSearchParams(prev => ({ ...prev, query: '', industry: industryName }));
    setAppMode('business_owner');
    setDashboardView('find_suppliers');
    performBusinessSearch({ industry: industryName });
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: 'var(--bg-base)' }}>

      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setAppMode('landing')}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}
            >
              B
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white">BizLink</span>
              <span
                className="hidden sm:inline px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
              >
                Universal
              </span>
            </div>
          </button>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {['Discovery', 'Network', 'Catalogue', 'About'].map(item => (
              <button
                key={item}
                className="px-3.5 py-2 text-xs font-medium rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchAccountType('individual')}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold rounded-lg transition-all"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              Explore
            </button>
            <button
              onClick={() => switchAccountType('businessman')}
              className="btn-primary text-xs"
            >
              Enterprise Portal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-20 pb-24 px-5 overflow-hidden">
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(34,211,238,0.08) 0%, transparent 50%)',
          }}
        />
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-30" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Eyebrow badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#a5b4fc',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connecting 190+ Countries · Every Industry · Zero Silos</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
              <span style={{ color: 'var(--text-primary)' }}>One Network.<br />Every Business.<br /></span>
              <span className="gradient-text text-glow-primary">Every Industry.</span>
            </h1>

            {/* Rotating industry ticker */}
            {mounted && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>Discover in</span>
                <span
                  className="font-bold text-sm px-3 py-1 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: '#a5b4fc',
                    minWidth: '160px',
                    textAlign: 'center',
                  }}
                >
                  {ROTATING_INDUSTRIES[rotatingIdx]}
                </span>
              </div>
            )}
          </div>

          {/* Subheading */}
          <p className="text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            BizLink connects manufacturers, agencies, freelancers, healthcare systems, logistics networks,
            creative studios, and independent specialists — without industry silos or geographic limits.
          </p>

          {/* ── SEARCH BAR ── */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleLandingSearch}
              className="glass-bright p-2 rounded-2xl flex flex-col sm:flex-row items-stretch gap-2"
              style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                <input
                  type="text"
                  value={landingQuery}
                  onChange={e => setLandingQuery(e.target.value)}
                  placeholder="Search capabilities, services, companies… (e.g. IoT, Biologics, CNC, Brand Design)"
                  className="w-full bg-transparent text-sm focus:outline-none"
                  style={{ color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              {/* Country selector */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl sm:rounded-none shrink-0"
                style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
              >
                <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={landingCountry}
                  onChange={e => setLandingCountry(e.target.value)}
                  className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="GLOBAL" style={{ background: '#111827' }}>🌐 Worldwide</option>
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.name} style={{ background: '#111827' }}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-accent text-xs shrink-0">
                Search Network <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {TRUST_BADGES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto text-left">
            {[
              { value: '190+', label: 'Countries', color: '#22d3ee' },
              { value: '100%', label: 'Industry-Independent', color: '#6366f1' },
              { value: 'P & S', label: 'Products & Services Unified', color: '#3b82f6' },
              { value: '360°', label: 'Ecosystem Graph', color: '#10b981' },
            ].map(stat => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-4 hover-lift"
              >
                <span className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</span>
                <p className="text-[11px] mt-1 leading-tight font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRY TAXONOMY GRID ===== */}
      <section className="py-20 px-5" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>Scalable Industry Taxonomy</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Every Sector. <span className="gradient-text">Connected as One.</span></h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Explore businesses across all major economic sectors without forced categorization.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {UNIVERSAL_TAXONOMY.map((tax, i) => (
              <button
                key={tax.id}
                onClick={() => handleSectorClick(tax.name)}
                className="glass-card rounded-2xl p-4 text-left hover-lift group transition-all duration-200 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${i * 0.04}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="text-2xl mb-3">{tax.icon}</div>
                <h4 className="text-xs font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                  {tax.name}
                </h4>
                <p className="text-[10px] mt-1 leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {tax.description}
                </p>
                <span
                  className="mt-3 flex items-center gap-1 text-[10px] font-bold group-hover:gap-2 transition-all"
                  style={{ color: 'var(--accent)' }}
                >
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: '#6366f1' }}>Architectural Foundations</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">How BizLink <span className="gradient-text">Redefines</span> Global Networking</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_GRID.map(({ icon: Icon, title, desc, accent, glow }) => (
              <div
                key={title}
                className="glass-card rounded-3xl p-6 hover-lift group relative overflow-hidden"
              >
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{ background: `radial-gradient(circle at top left, ${glow}, transparent 60%)` }}
                />

                <div
                  className="relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <h3 className="relative z-10 text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="relative z-10 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-10 sm:p-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(59,130,246,0.12) 50%, rgba(34,211,238,0.10) 100%)',
              border: '1px solid rgba(99,102,241,0.25)',
              boxShadow: '0 0 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'rgba(99,102,241,0.15)' }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Star className="w-4 h-4" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                  <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>Universal Business Network</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Ready to Join the Network?
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', maxWidth: '480px' }}>
                  Establish your verified enterprise profile and connect with businesses across any sector worldwide. Free to join. No industry restrictions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="btn-primary text-sm"
                >
                  <Building2 className="w-4 h-4" />
                  Register Enterprise
                </button>
                <button
                  onClick={() => { switchAccountType('individual'); }}
                  className="btn-secondary text-sm"
                >
                  Explore Network <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 px-5" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >B</div>
            <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>BizLink</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Universal Business Network</span>
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            One Network. Every Business. Every Industry. Worldwide.
          </p>
        </div>
      </footer>

      <RegisterBusinessModal />
    </div>
  );
}
