'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Globe, ShoppingBag, Coins, Bell, ChevronDown } from 'lucide-react';
import { GLOBAL_CURRENCIES, GLOBAL_COUNTRIES } from '@/data/taxonomy';

export function DashboardHeader() {
  const {
    myBusiness,
    setAppMode,
    setDashboardView,
    activeCurrency,
    setActiveCurrency,
    useMockMode,
  } = useBizLink();

  const country = GLOBAL_COUNTRIES.find(c => c.code === myBusiness.location.countryCode) || GLOBAL_COUNTRIES[0];

  return (
    <header
      className="sticky top-0 z-20 px-5 h-14 flex items-center justify-between gap-4"
      style={{
        background: 'rgba(8,13,26,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Left — business identity */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        <span className="text-lg leading-none shrink-0">{country.flag}</span>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white truncate leading-tight">{myBusiness.name}</h2>
          <div className="flex items-center gap-2 mt-px">
            <span
              className="text-[10px] font-mono px-1.5 py-px rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {myBusiness.businessCode}
            </span>
            <span
              className="hidden md:inline text-[10px] font-semibold px-2 py-px rounded-full"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              {myBusiness.industry}
            </span>
          </div>
        </div>
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Currency switcher */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Coins className="w-3.5 h-3.5" style={{ color: '#fbbf24' }} />
          <select
            value={activeCurrency}
            onChange={e => setActiveCurrency(e.target.value)}
            className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
          >
            {GLOBAL_CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code} style={{ background: '#111827' }}>
                {curr.code} {curr.symbol}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Network status */}
        <div
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
          }}
        >
          <Globe className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
          <span style={{ color: 'var(--text-muted)' }}>Network:</span>
          <span style={{ color: '#60a5fa', fontWeight: 700 }}>
            {useMockMode ? 'Sandbox' : 'Live'}
          </span>
        </div>

        {/* Client Explorer toggle */}
        <button
          onClick={() => setAppMode('customer')}
          className="btn-secondary text-xs py-1.5 px-3"
          title="Switch to customer & partner discovery view"
        >
          <ShoppingBag className="w-3.5 h-3.5" style={{ color: '#6366f1' }} />
          <span className="hidden md:inline">Explorer</span>
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
        >
          <Bell className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
            style={{ background: '#6366f1' }}
          />
        </button>

        {/* Avatar */}
        <button
          onClick={() => setDashboardView('profile')}
          className="flex items-center gap-2 p-1 pr-2 rounded-xl transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)' }}
          >
            {myBusiness.ownerName.charAt(0)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold leading-tight text-white">{myBusiness.ownerName}</p>
            <p className="text-[10px] leading-tight" style={{ color: 'var(--text-muted)' }}>
              {myBusiness.primaryBusinessModel}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
