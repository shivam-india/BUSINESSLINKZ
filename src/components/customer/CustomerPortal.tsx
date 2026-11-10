'use client';

import React, { useState, useEffect } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  ExternalLink,
  Building2,
  Navigation,
  Receipt,
  Crosshair,
  User,
  Package,
  Wrench,
  Globe,
} from 'lucide-react';
import { BusinessProfileModal } from '../modals/BusinessProfileModal';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { formatCurrencyAmount, GLOBAL_COUNTRIES } from '@/data/taxonomy';

const UNIVERSAL_CATEGORIES = [
  { label: 'All Businesses & Specialists', query: '', icon: '🌐' },
  { label: 'Technology, AI & Software', query: 'Software', icon: '💻' },
  { label: 'Healthcare & Medical Devices', query: 'Medical', icon: '🏥' },
  { label: 'Creative Design & Branding', query: 'Design', icon: '🎨' },
  { label: 'Precision Manufacturing & Tooling', query: 'Manufacturing', icon: '🏭' },
  { label: 'Legal & Corporate Advisory', query: 'Legal', icon: '⚖️' },
  { label: 'Architecture & Sustainable Design', query: 'Architecture', icon: '🏗️' },
  { label: 'Logistics & Cold Chain', query: 'Logistics', icon: '🚢' },
  { label: 'Bakery & Specialty Food', query: 'Bakery', icon: '🥐' },
  { label: 'Beauty Salons & Wellness', query: 'Salon', icon: '💄' },
  { label: 'Auto Mechanics & Diagnostics', query: 'Mechanic', icon: '🔧' },
  { label: 'Electronics & Smart Hardware', query: 'Electronics', icon: '⚡' },
];

export function CustomerPortal() {
  const {
    businesses,
    savedBusinesses,
    toggleSaveBusiness,
    setInspectingBusiness,
    setAppMode,
    currentUser,
    switchAccountType,
    performBusinessSearch,
    searchResults,
    isSearching,
    detectUserLocation,
    isDetectingLocation,
    transactions,
    activeCurrency,
  } = useBizLink();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Businesses & Specialists');
  const [userLocation, setUserLocation] = useState('Austin, TX');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  useEffect(() => {
    if (!searchResults) {
      performBusinessSearch({
        query: '',
        location: 'Worldwide',
        radiusKm: 50,
      });
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performBusinessSearch({
      query: searchQuery,
      location: userLocation,
    });
  };

  const handleCategoryClick = (cat: typeof UNIVERSAL_CATEGORIES[0]) => {
    setActiveCategory(cat.label);
    setSearchQuery(cat.query);
    performBusinessSearch({
      query: cat.query,
      location: userLocation,
    });
  };

  const myKhataTransactions = transactions.filter(
    t => t.customerName === currentUser.name || t.type === 'Debit'
  );
  const myTotalBalance = myKhataTransactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const displayedBusinesses = searchResults?.results || businesses;

  const finalFiltered = displayedBusinesses.filter(b => {
    if (showSavedOnly && !savedBusinesses.includes(b.id)) return false;
    return true;
  });

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Header */}
      <header
        className="glass border-b px-6 py-3.5 sticky top-0 z-30"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setAppMode('landing')}
            className="flex items-center gap-3 group text-left"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-lg text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">BizLink</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
                  style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
                >
                  Global Explorer
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Discover businesses, procure offerings & manage engagements</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-200">{currentUser.name}</span>
            </div>

            <button
              onClick={() => switchAccountType('businessman')}
              className="btn-primary text-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              Enterprise Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Active Balance Banner if any */}
      {myTotalBalance > 0 && (
        <div
          className="px-6 py-2.5 font-bold text-xs"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(34,211,238,0.1) 100%)',
            borderBottom: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-slate-200">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>
                Active commercial engagements totaling <strong className="text-white font-mono">{formatCurrencyAmount(myTotalBalance, activeCurrency)}</strong> across verified network partners.
              </span>
            </div>
            <span
              className="text-[10px] px-3 py-0.5 rounded-full font-black"
              style={{ background: '#22d3ee', color: '#04070f' }}
            >
              Verified Digital Ledger
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6 bg-mesh">
        {/* Search & Location Bar */}
        <div className="glass-card rounded-3xl p-5 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div
              className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl w-full"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Search className="w-4 h-4 text-cyan-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, services, capabilities, or companies worldwide..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl w-full md:w-48 shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  value={userLocation}
                  onChange={e => setUserLocation(e.target.value)}
                  placeholder="City or Country..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => detectUserLocation()}
                disabled={isDetectingLocation}
                className="p-2.5 rounded-2xl transition-colors shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                title="Locate with GPS"
              >
                <Crosshair className={`w-4 h-4 text-cyan-400 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="submit"
                disabled={isSearching}
                className="btn-accent text-xs py-2.5 px-5 shrink-0"
              >
                {isSearching ? 'Searching...' : 'Explore'}
              </button>
            </div>
          </form>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {UNIVERSAL_CATEGORIES.map(cat => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.label
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={
                  activeCategory !== cat.label
                    ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }
                    : {}
                }
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Filter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p>
            Showing <strong className="text-white">{finalFiltered.length}</strong> verified enterprises & specialists
          </p>

          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
            style={{
              background: showSavedOnly ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.04)',
              color: showSavedOnly ? '#f43f5e' : 'var(--text-secondary)',
              border: showSavedOnly ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            Saved Bookmarks ({savedBusinesses.length})
          </button>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {finalFiltered.map((biz, idx) => {
            const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
            const isSaved = savedBusinesses.includes(biz.id);

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
                  <div
                    className="h-24 p-4 flex items-start justify-between relative"
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

                    <button
                      onClick={() => toggleSaveBusiness(biz.id)}
                      className="p-2 rounded-full transition-colors"
                      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                      title={isSaved ? 'Remove from bookmarks' : 'Bookmark business'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                          {biz.industry}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{biz.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                        {biz.name}
                      </h3>
                      <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {biz.tagline || biz.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                      >
                        {biz.primaryBusinessModel}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}
                      >
                        Scope: {biz.serviceCoverage.scope}
                      </span>
                    </div>

                    {biz.offerings && biz.offerings.length > 0 && (
                      <div
                        className="p-3 rounded-2xl space-y-1.5 text-xs"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
                          Top Offerings:
                        </span>
                        {biz.offerings.slice(0, 2).map(off => (
                          <div key={off.id} className="flex items-center justify-between">
                            <span className="font-semibold text-slate-300 truncate pr-2 flex items-center gap-1.5">
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
                  </div>
                </div>

                <div
                  className="p-5 pt-3 mt-2 flex items-center gap-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <button
                    onClick={() => setInspectingBusiness(biz)}
                    className="btn-secondary flex-1 text-xs py-2"
                  >
                    View Details
                  </button>

                  <a
                    href={
                      biz.directionsUrl ||
                      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        biz.name + ' ' + biz.location.city
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-cyan-400 transition-colors"
                    style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)' }}
                    title="Get Directions"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BusinessProfileModal />
      <AddTransactionModal />
    </div>
  );
}
