'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Globe,
  Zap,
  ShoppingBag,
  Coins,
} from 'lucide-react';
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
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Enterprise identity & Global Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-base">{country.flag}</span>
          <h2 className="text-sm font-bold text-slate-800 hidden sm:block truncate max-w-[280px]">
            {myBusiness.name}
          </h2>
          <span className="text-xs text-slate-400 font-mono hidden md:inline px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
            {myBusiness.businessCode}
          </span>
          <span className="hidden xl:inline text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {myBusiness.industry}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        {/* Currency Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Coins className="w-3.5 h-3.5 text-amber-600" />
          <select
            value={activeCurrency}
            onChange={(e) => setActiveCurrency(e.target.value)}
            className="bg-transparent border-none text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            {GLOBAL_CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Global Discovery status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 hidden lg:inline">Network:</span>
          <span className="text-blue-700 font-bold">
            {useMockMode ? 'Global Sandbox' : 'Global Live'}
          </span>
        </div>

        {/* Quick Link to Customer Mode */}
        <button
          onClick={() => setAppMode('customer')}
          className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-300 shadow-2xs"
          title="Switch to customer & partner discovery view"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline">Client /</span> Explorer View
        </button>

        {/* User profile avatar */}
        <div
          onClick={() => setDashboardView('profile')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {myBusiness.ownerName.charAt(0)}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{myBusiness.ownerName}</p>
            <p className="text-[10px] text-slate-500 font-medium">{myBusiness.primaryBusinessModel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
