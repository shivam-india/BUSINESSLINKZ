'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Business, UniversalRelationshipType } from '@/types';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Building2,
  Package,
  Wrench,
  Globe,
  CheckCircle2,
  Eye,
  Crosshair,
  Handshake,
  Sparkles,
  ExternalLink,
  X,
  Filter,
} from 'lucide-react';
import {
  UNIVERSAL_TAXONOMY,
  UNIVERSAL_BUSINESS_MODELS,
  GLOBAL_COUNTRIES,
  UNIVERSAL_RELATIONSHIP_TYPES,
  formatCurrencyAmount,
} from '@/data/taxonomy';

export function FindSuppliersView() {
  const {
    businesses,
    relationships,
    connectBusinesses,
    setInspectingBusiness,
    performBusinessSearch,
    searchResults,
    isSearching,
    detectUserLocation,
    isDetectingLocation,
    myBusiness,
  } = useBizLink();

  const [queryInput, setQueryInput] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [offeringFilter, setOfferingFilter] = useState<'all' | 'product' | 'service'>('all');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'global' | 'local'>('all');

  // Connect modal state
  const [connectingBiz, setConnectingBiz] = useState<Business | null>(null);
  const [relTypeToForm, setRelTypeToForm] = useState<UniversalRelationshipType>('Strategic Partner ↔ Partner');
  const [relCategory, setRelCategory] = useState('Cross-Sector Enterprise Partnership');

  // Available businesses for discovery (excluding own business)
  const directoryList =
    searchResults?.results && searchResults.results.length > 0
      ? searchResults.results
      : businesses;

  const filteredBusinesses = directoryList.filter(b => {
    if (b.id === myBusiness.id) return false;

    // Industry filter
    if (selectedIndustry !== 'all' && b.industry !== selectedIndustry) {
      return false;
    }

    // Business model filter
    if (selectedModel !== 'all' && !b.businessModels.some(m => m === selectedModel)) {
      return false;
    }

    // Country filter
    if (selectedCountry !== 'all' && b.location.countryCode !== selectedCountry) {
      return false;
    }

    // Offering filter (products vs services)
    if (offeringFilter === 'product' && (!b.products || b.products.length === 0)) {
      return false;
    }
    if (offeringFilter === 'service' && (!b.services || b.services.length === 0)) {
      return false;
    }

    // Scope filter
    if (scopeFilter === 'global' && b.serviceCoverage.scope !== 'Global / Remote') {
      return false;
    }
    if (scopeFilter === 'local' && b.serviceCoverage.scope === 'Global / Remote') {
      return false;
    }

    // Query text match
    if (queryInput.trim()) {
      const q = queryInput.toLowerCase();
      const corpus = `${b.name} ${b.tagline || ''} ${b.industry} ${b.subIndustry || ''} ${b.description} ${b.categories.join(' ')} ${b.capabilities.join(' ')} ${b.skills.join(' ')} ${b.location.city} ${b.location.country}`.toLowerCase();
      return corpus.includes(q);
    }

    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performBusinessSearch({
      query: queryInput,
      industry: selectedIndustry !== 'all' ? selectedIndustry : undefined,
      businessModel: selectedModel !== 'all' ? selectedModel : undefined,
      offeringType: offeringFilter,
    });
  };

  const handleFormConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectingBiz) return;
    connectBusinesses(connectingBiz, relTypeToForm, relCategory);
    setConnectingBiz(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 pb-12">
      {/* Search Header Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.1) 50%, rgba(13,21,38,0.95) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 60px rgba(99,102,241,0.1)',
        }}
      >
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  style={{
                    background: 'rgba(34,211,238,0.15)',
                    color: '#22d3ee',
                    border: '1px solid rgba(34,211,238,0.3)',
                  }}
                >
                  Universal Discovery Engine
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  190+ Countries • Every Industry
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                Discover Businesses, Partners & Services Worldwide
              </h1>
              <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Find and connect with AI innovators, precision manufacturers, creative studios, logistics networks, healthcare providers, and specialized consultants without artificial industry silos.
              </p>
            </div>

            <button
              onClick={() => detectUserLocation()}
              disabled={isDetectingLocation}
              className="btn-secondary text-xs self-start md:self-auto shrink-0"
            >
              <Crosshair className={`w-3.5 h-3.5 text-cyan-400 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              {isDetectingLocation ? 'Locating...' : 'Use Browser GPS'}
            </button>
          </div>

          {/* Global Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div
              className="glass-bright p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  placeholder="Search by product, service, capability, or company (e.g. IoT, Brand Identity, CNC, Biologics)..."
                  className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
                />
              </div>

              {/* Offering Type Toggle */}
              <div
                className="flex items-center p-1 rounded-xl shrink-0 self-stretch sm:self-auto"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <button
                  type="button"
                  onClick={() => setOfferingFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    offeringFilter === 'all'
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setOfferingFilter('product')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    offeringFilter === 'product'
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Package className="w-3 h-3" />
                  Products
                </button>
                <button
                  type="button"
                  onClick={() => setOfferingFilter('service')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    offeringFilter === 'service'
                      ? 'bg-cyan-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wrench className="w-3 h-3" />
                  Services
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="btn-accent text-xs w-full sm:w-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isSearching ? 'Searching...' : 'Explore Network'}
              </button>
            </div>

            {/* Secondary Taxonomy & Country Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Industry Selector */}
              <div
                className="px-3 py-2 rounded-xl text-xs flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Sector:</span>
                <select
                  value={selectedIndustry}
                  onChange={e => setSelectedIndustry(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  <option value="all" style={{ background: '#0d1526' }}>All Sectors</option>
                  {UNIVERSAL_TAXONOMY.map(t => (
                    <option key={t.id} value={t.name} style={{ background: '#0d1526' }}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Model Selector */}
              <div
                className="px-3 py-2 rounded-xl text-xs flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Model:</span>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  <option value="all" style={{ background: '#0d1526' }}>Any Business Model</option>
                  {UNIVERSAL_BUSINESS_MODELS.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#0d1526' }}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Selector */}
              <div
                className="px-3 py-2 rounded-xl text-xs flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Geography:</span>
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
                >
                  <option value="all" style={{ background: '#0d1526' }}>🌐 Global / All Countries</option>
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} style={{ background: '#0d1526' }}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Discovery Results Count & Scope Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="font-semibold">
          Showing <span className="text-white font-bold">{filteredBusinesses.length}</span> verified enterprises
        </span>
        <div
          className="flex items-center gap-1 p-1 rounded-xl self-start sm:self-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => setScopeFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Scopes
          </button>
          <button
            onClick={() => setScopeFilter('global')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'global'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Global / Remote
          </button>
          <button
            onClick={() => setScopeFilter('local')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'local'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Regional / Local
          </button>
        </div>
      </div>

      {/* Enterprise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBusinesses.map((biz, idx) => {
          const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
          const isConnected = relationships.some(
            r =>
              (r.sourceId === myBusiness.id && r.targetId === biz.id) ||
              (r.sourceId === biz.id && r.targetId === myBusiness.id)
          );

          return (
            <div
              key={biz.id}
              className="glass-card rounded-3xl overflow-hidden hover-lift flex flex-col justify-between group animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${idx * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div>
                {/* Header Banner */}
                <div
                  className="h-24 p-4 flex items-start justify-between relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${biz.bannerGradient ? biz.bannerGradient.replace('from-', '').replace('to-', '') : '#3b82f6, #6366f1'})`,
                  }}
                >
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-bold"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <span>{country.flag}</span>
                    <span>{biz.location.city}, {biz.location.country}</span>
                  </div>

                  <span
                    className="px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase"
                    style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    {biz.serviceCoverage?.scope || 'Global'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3.5">
                  {/* Title & Industry Badges */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                        {biz.industry}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{biz.rating}</span>
                        <span className="text-slate-500 font-normal">({biz.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                      {biz.name}
                    </h3>
                    <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {biz.tagline || biz.description}
                    </p>
                  </div>

                  {/* Business Model Pill */}
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {biz.primaryBusinessModel}
                    </span>
                    {biz.subIndustry && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}
                      >
                        {biz.subIndustry}
                      </span>
                    )}
                  </div>

                  {/* Top Offerings Preview */}
                  {biz.offerings && biz.offerings.length > 0 && (
                    <div
                      className="p-3 rounded-2xl space-y-1.5"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                        Featured Offerings:
                      </span>
                      {biz.offerings.slice(0, 2).map(off => (
                        <div key={off.id} className="flex items-center justify-between text-xs">
                          <span className="font-semibold truncate pr-2 flex items-center gap-1.5 text-slate-300">
                            {off.type === 'product' ? (
                              <Package className="w-3 h-3 text-indigo-400 shrink-0" />
                            ) : (
                              <Wrench className="w-3 h-3 text-cyan-400 shrink-0" />
                            )}
                            {off.name}
                          </span>
                          <span className="font-mono text-cyan-300 font-bold shrink-0">
                            {formatCurrencyAmount(off.price, off.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Requirements / "Seeking" Synergies */}
                  {biz.businessRequirements?.lookingForPartnerships && (
                    <div
                      className="text-[10px] p-2.5 rounded-xl leading-relaxed"
                      style={{
                        background: 'rgba(99,102,241,0.08)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <span className="font-bold text-indigo-300 block mb-0.5">🤝 Seeking Partnerships:</span>
                      <p className="truncate text-slate-300">{biz.businessRequirements.lookingForPartnerships.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="p-5 pt-3 mt-2 flex items-center gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <button
                  onClick={() => setInspectingBusiness(biz)}
                  className="btn-secondary flex-1 text-xs py-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Full Profile
                </button>

                {isConnected ? (
                  <span
                    className="px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setConnectingBiz(biz);
                      setRelCategory(`Cross-Sector Synergy with ${biz.name}`);
                    }}
                    className="btn-primary text-xs py-2 px-3.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Connect
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBusinesses.length === 0 && (
        <div
          className="p-16 text-center rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">No Businesses Matched Filter</h3>
          <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            Try broadening your search term, clearing industry restrictions, or selecting &quot;Global / All Countries&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedIndustry('all');
              setSelectedModel('all');
              setSelectedCountry('all');
              setQueryInput('');
            }}
            className="btn-primary text-xs mt-4"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Connect Modal */}
      {connectingBiz && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="rounded-3xl w-full max-w-lg p-6 space-y-5 animate-fade-in-up"
            style={{
              background: '#0d1526',
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.2)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}
                >
                  <Handshake className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Connect with {connectingBiz.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {connectingBiz.industry} • {connectingBiz.location.city}, {connectingBiz.location.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConnectingBiz(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormConnection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Relationship Type *</label>
                <select
                  value={relTypeToForm}
                  onChange={e => setRelTypeToForm(e.target.value as UniversalRelationshipType)}
                  className="w-full p-2.5 rounded-xl font-medium focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                  }}
                >
                  {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                    <option key={rel.id} value={rel.id} style={{ background: '#0d1526' }}>
                      {rel.label} — {rel.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Synergy / Engagement Scope</label>
                <input
                  type="text"
                  value={relCategory}
                  onChange={e => setRelCategory(e.target.value)}
                  placeholder="e.g. Cross-border Cloud Architecture & Strategic Marketing Retainer"
                  className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>

              <div
                className="p-3.5 rounded-xl text-xs leading-relaxed"
                style={{
                  background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: 'var(--text-secondary)',
                }}
              >
                <p className="font-bold text-indigo-300 mb-0.5">Universal Network Principle:</p>
                Professional connection establishes mutual discovery on the ecosystem graph. Specific commercial contracts or invoices can be tracked separately in the Deals Ledger.
              </div>

              <div
                className="flex justify-end gap-2 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  type="button"
                  onClick={() => setConnectingBiz(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Establish Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
