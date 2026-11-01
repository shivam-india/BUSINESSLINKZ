'use client';

import React from 'react';
import { useBizLink, DashboardView } from '@/context/BizLinkContext';
import {
  LayoutDashboard,
  Globe,
  Layers,
  Package,
  Receipt,
  Star,
  Building2,
  Settings,
  Sparkles,
  LogOut,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { GLOBAL_COUNTRIES } from '@/data/taxonomy';

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'find_suppliers', label: 'Universal Discovery', icon: Globe, badge: 'Worldwide', highlight: true },
  { id: 'network', label: 'Ecosystem Graph', icon: Layers, badge: '360°' },
  { id: 'products', label: 'Offerings & Catalogue', icon: Package, badge: 'P & S' },
  { id: 'transactions', label: 'Deals & Global Ledger', icon: Receipt },
  { id: 'reviews', label: 'Credentials & Trust', icon: Star },
  { id: 'profile', label: 'Universal Profile', icon: Building2 },
  { id: 'settings', label: 'Settings & Integrations', icon: Settings },
];

export function Sidebar() {
  const {
    dashboardView,
    setDashboardView,
    myBusiness,
    setAppMode,
    setIsRegisterModalOpen,
  } = useBizLink();

  const countryConfig = GLOBAL_COUNTRIES.find(c => c.code === myBusiness.location.countryCode) || GLOBAL_COUNTRIES[0];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div
          onClick={() => setAppMode('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white">BizLink</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                GLOBAL
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">One Network. Every Business.</p>
          </div>
        </div>

        {/* Current Active Business Card */}
        <div className="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-inner">
          <div className="flex items-start justify-between">
            <div className="min-w-0 pr-1">
              <h5 className="text-xs font-bold text-white truncate">{myBusiness.name}</h5>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 truncate">
                <span>{countryConfig.flag}</span>
                <span className="text-slate-300">{myBusiness.location.city}, {myBusiness.location.countryCode}</span>
              </div>
            </div>
            {myBusiness.verified && (
              <span title="Verified Enterprise"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /></span>
            )}
          </div>
          
          <div className="mt-2 flex items-center justify-between text-[10px] font-medium bg-black/40 px-2 py-1 rounded-lg border border-slate-700/50">
            <span className="text-cyan-400 truncate max-w-[130px]">{myBusiness.industry}</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Universal Operations
        </div>

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = dashboardView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setDashboardView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              } ${item.highlight && !isActive ? 'ring-1 ring-cyan-500/40 text-cyan-300 bg-cyan-950/20' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.highlight
                      ? 'bg-cyan-500/30 text-cyan-200'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="w-full py-2 bg-gradient-to-r from-indigo-600/40 to-blue-600/40 hover:from-indigo-600/60 hover:to-blue-600/60 border border-indigo-500/30 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Add Business Entity
        </button>

        <button
          onClick={() => setAppMode('landing')}
          className="w-full py-2 text-slate-400 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Back to Global Directory
        </button>
      </div>
    </aside>
  );
}
