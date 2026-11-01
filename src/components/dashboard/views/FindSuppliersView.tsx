'use client';

import React, { useState, useEffect } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Business, UniversalRelationshipType } from '@/types';
import {
  Search,
  MapPin,
  Filter,
  SlidersHorizontal,
  Star,
  ShieldCheck,
  Building2,
  Package,
  Wrench,
  Globe,
  Plus,
  CheckCircle2,
  Eye,
  Zap,
  RotateCw,
  Tag,
  Crosshair,
  Handshake,
  Compass,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import { UNIVERSAL_TAXONOMY, UNIVERSAL_BUSINESS_MODELS, GLOBAL_COUNTRIES, UNIVERSAL_RELATIONSHIP_TYPES, formatCurrencyAmount } from '@/data/taxonomy';

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
    searchParams,
    setSearchParams,
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
  const directoryList = searchResults?.results && searchResults.results.length > 0
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                UNIVERSAL DISCOVERY ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">190+ Countries • Every Industry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5">
              Discover Businesses, Partners & Services Worldwide
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Find and connect with AI innovators, precision manufacturers, creative studios, logistics networks, hospitals, and specialized consultants without artificial industry barriers.
            </p>
          </div>

          <button
            onClick={() => detectUserLocation()}
            disabled={isDetectingLocation}
            className="self-start md:self-auto px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition-all shrink-0"
          >
            <Crosshair className={`w-3.5 h-3.5 text-cyan-400 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            {isDetectingLocation ? 'Locating...' : 'Use Browser GPS'}
          </button>
        </div>

        {/* Global Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 p-2 rounded-2xl border border-white/15 backdrop-blur-md">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full">
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                placeholder="Search by product, service, capability, skill (e.g. IoT, Brand Identity, CNC, Biologics, Cold Chain)..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Offering Type Toggle */}
            <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-700/60 shrink-0 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setOfferingFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  offeringFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                All Offerings
              </button>
              <button
                type="button"
                onClick={() => setOfferingFilter('product')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  offeringFilter === 'product' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                <Package className="w-3 h-3" />
                Products
              </button>
              <button
                type="button"
                onClick={() => setOfferingFilter('service')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  offeringFilter === 'service' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400'
                }`}
              >
                <Wrench className="w-3 h-3" />
                Services
              </button>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSearching ? 'Searching...' : 'Explore Network'}
            </button>
          </div>

          {/* Secondary Taxonomy & Country Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Industry Selector */}
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Industry:</span>
              <select
                value={selectedIndustry}
                onChange={e => setSelectedIndustry(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                <option value="all" className="bg-slate-900">All Sectors</option>
                {UNIVERSAL_TAXONOMY.map(t => (
                  <option key={t.id} value={t.name} className="bg-slate-900">
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Model Selector */}
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Business Model:</span>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                <option value="all" className="bg-slate-900">Any Business Model</option>
                {UNIVERSAL_BUSINESS_MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-slate-900">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selector */}
            <div className="bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Geography:</span>
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                <option value="all" className="bg-slate-900">🌐 Global / Any Country</option>
                {GLOBAL_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-slate-900">
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Discovery Results Count & Scope Toggle */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold">
          Showing <span className="text-slate-900 font-bold">{filteredBusinesses.length}</span> verified enterprises matching your criteria
        </span>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setScopeFilter('all')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            All Scopes
          </button>
          <button
            onClick={() => setScopeFilter('global')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'global' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Global / Remote
          </button>
          <button
            onClick={() => setScopeFilter('local')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              scopeFilter === 'local' ? 'bg-white text-cyan-600 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Regional / Local
          </button>
        </div>
      </div>

      {/* Enterprise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map(biz => {
          const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
          const isConnected = relationships.some(
            r =>
              (r.sourceId === myBusiness.id && r.targetId === biz.id) ||
              (r.sourceId === biz.id && r.targetId === myBusiness.id)
          );

          return (
            <div
              key={biz.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Banner */}
                <div className={`h-24 bg-gradient-to-r ${biz.bannerGradient || 'from-indigo-600 to-blue-500'} p-4 flex items-start justify-between relative`}>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                    <span>{country.flag}</span>
                    <span>{biz.location.city}, {biz.location.country}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase border border-white/30">
                    {biz.serviceCoverage?.scope || 'Global'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3.5">
                  {/* Title & Industry Badges */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                        {biz.industry}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{biz.rating}</span>
                        <span className="text-slate-400 font-normal">({biz.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                      {biz.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {biz.tagline || biz.description}
                    </p>
                  </div>

                  {/* Business Model Pill */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {biz.primaryBusinessModel}
                    </span>
                    {biz.subIndustry && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        {biz.subIndustry}
                      </span>
                    )}
                  </div>

                  {/* Top Offerings Preview */}
                  {biz.offerings && biz.offerings.length > 0 && (
                    <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Featured Offerings:
                      </span>
                      {biz.offerings.slice(0, 2).map(off => (
                        <div key={off.id} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 truncate pr-2 flex items-center gap-1">
                            {off.type === 'product' ? <Package className="w-3 h-3 text-indigo-500" /> : <Wrench className="w-3 h-3 text-cyan-500" />}
                            {off.name}
                          </span>
                          <span className="font-mono text-slate-900 font-bold shrink-0">
                            {formatCurrencyAmount(off.price, off.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Requirements / "Seeking" Synergies */}
                  {biz.businessRequirements?.lookingForPartnerships && (
                    <div className="text-[10px] text-slate-500 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/70">
                      <span className="font-bold text-indigo-900 block mb-0.5">🤝 Seeking Partnerships:</span>
                      <p className="text-slate-600 truncate">{biz.businessRequirements.lookingForPartnerships.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                <button
                  onClick={() => setInspectingBusiness(biz)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Full Profile
                </button>

                {isConnected ? (
                  <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setConnectingBiz(biz);
                      setRelCategory(`Cross-Sector Synergy with ${biz.name}`);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
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
        <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Businesses Matched Filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try broadening your search term, clearing industry restrictions, or selecting &quot;All Countries&quot;.
          </p>
          <button
            onClick={() => {
              setSelectedIndustry('all');
              setSelectedModel('all');
              setSelectedCountry('all');
              setQueryInput('');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Connect Modal */}
      {connectingBiz && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Connect with {connectingBiz.name}</h3>
                  <p className="text-xs text-slate-500">{connectingBiz.industry} • {connectingBiz.location.city}, {connectingBiz.location.country}</p>
                </div>
              </div>
              <button onClick={() => setConnectingBiz(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormConnection} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Relationship Type *</label>
                <select
                  value={relTypeToForm}
                  onChange={e => setRelTypeToForm(e.target.value as UniversalRelationshipType)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                    <option key={rel.id} value={rel.id}>
                      {rel.label} — {rel.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Synergy / Engagement Scope</label>
                <input
                  type="text"
                  value={relCategory}
                  onChange={e => setRelCategory(e.target.value)}
                  placeholder="e.g. Cross-border Cloud Architecture & Strategic Marketing Retainer"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-slate-600 leading-relaxed">
                <p className="font-bold text-indigo-900 mb-0.5">Universal Network Principle:</p>
                Professional connection establishes mutual discovery on the ecosystem graph. Specific commercial contracts or invoices can be tracked separately in the Deals Ledger.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConnectingBiz(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-md"
                >
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
