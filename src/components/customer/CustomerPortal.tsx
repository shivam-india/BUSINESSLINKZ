'use client';

import React, { useState, useEffect } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  ShoppingBag,
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Heart,
  Phone,
  ArrowRight,
  ExternalLink,
  Clock,
  Tag,
  Building2,
  CheckCircle2,
  MessageCircle,
  Navigation,
  Receipt,
  Crosshair,
  User,
  RotateCw,
  Globe,
  Package,
  Wrench,
  Coins,
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
    showToast,
    currentUser,
    switchAccountType,
    searchParams,
    setSearchParams,
    performBusinessSearch,
    searchResults,
    isSearching,
    detectUserLocation,
    isDetectingLocation,
    transactions,
    setIsAddTransactionModalOpen,
    setPrefilledTxBusiness,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => setAppMode('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900">BizLink</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-50 text-cyan-700 border border-cyan-200">
                  Global Explorer Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Discover businesses, procure offerings & manage engagements</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentUser.name}</span>
            </div>

            <button
              onClick={() => switchAccountType('businessman')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Enterprise Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Active Balance Banner if any */}
      {myTotalBalance > 0 && (
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white px-6 py-3 border-b border-indigo-800 font-bold text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>
                You have active commercial engagements totaling <strong>{formatCurrencyAmount(myTotalBalance, activeCurrency)}</strong> across verified network partners.
              </span>
            </div>
            <span className="text-[10px] bg-cyan-500 text-slate-950 px-3 py-1 rounded-full font-black">
              Verified Digital Ledger
            </span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Search & Location Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-full">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, services, capabilities, or companies worldwide..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl w-full md:w-48 shrink-0">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  value={userLocation}
                  onChange={e => setUserLocation(e.target.value)}
                  placeholder="City or Country..."
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => detectUserLocation()}
                disabled={isDetectingLocation}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-200 transition-colors shrink-0"
                title="Locate with GPS"
              >
                <Crosshair className={`w-4 h-4 text-indigo-600 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all shrink-0"
              >
                {isSearching ? 'Searching...' : 'Search'}
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
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count & Filter */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing <strong>{finalFiltered.length}</strong> verified enterprises & service providers
          </p>

          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors ${
              showSavedOnly ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
            Saved Bookmarks ({savedBusinesses.length})
          </button>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalFiltered.map(biz => {
            const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
            const isSaved = savedBusinesses.includes(biz.id);

            return (
              <div
                key={biz.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`h-24 bg-gradient-to-r ${biz.bannerGradient || 'from-indigo-600 to-blue-500'} p-4 flex items-start justify-between relative`}>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                      <span>{country.flag}</span>
                      <span>{biz.location.city}, {biz.location.country}</span>
                    </div>

                    <button
                      onClick={() => toggleSaveBusiness(biz.id)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                      title={isSaved ? 'Remove from bookmarks' : 'Bookmark business'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                          {biz.industry}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{biz.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                        {biz.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {biz.tagline || biz.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {biz.primaryBusinessModel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        Scope: {biz.serviceCoverage.scope}
                      </span>
                    </div>

                    {biz.offerings && biz.offerings.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Top Offerings:
                        </span>
                        {biz.offerings.slice(0, 2).map(off => (
                          <div key={off.id} className="flex items-center justify-between">
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
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setInspectingBusiness(biz)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    View Details
                  </button>

                  <a
                    href={biz.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(biz.name + ' ' + biz.location.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
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
