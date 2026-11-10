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
  Plus,
} from 'lucide-react';
import { GLOBAL_COUNTRIES } from '@/data/taxonomy';

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ElementType;
  badge?: string;
  accentColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',        label: 'Overview',              icon: LayoutDashboard },
  { id: 'find_suppliers',  label: 'Universal Discovery',   icon: Globe,     badge: 'Worldwide', accentColor: '#22d3ee' },
  { id: 'network',         label: 'Ecosystem Graph',       icon: Layers,    badge: '360°',      accentColor: '#8b5cf6' },
  { id: 'products',        label: 'Offerings & Catalogue', icon: Package,   badge: 'P & S' },
  { id: 'transactions',    label: 'Commercial Ledger',     icon: Receipt },
  { id: 'reviews',         label: 'Trust & Credentials',   icon: Star },
  { id: 'profile',         label: 'Universal Profile',     icon: Building2 },
  { id: 'settings',        label: 'Settings',              icon: Settings },
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
    <aside
      className="w-60 flex flex-col shrink-0 h-screen sticky top-0 select-none"
      style={{
        background: 'rgba(8,13,26,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Brand Header ── */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => setAppMode('landing')}
          className="flex items-center gap-2.5 w-full group"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shrink-0 transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              boxShadow: '0 0 16px rgba(99,102,241,0.35)',
            }}
          >
            B
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white">BizLink</span>
              <span
                className="px-1.5 py-px rounded text-[9px] font-black uppercase tracking-widest"
                style={{ background: 'rgba(34,211,238,0.1)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
              >
                GLOBAL
              </span>
            </div>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Every Business. Worldwide.
            </p>
          </div>
        </button>

        {/* Business card */}
        <div
          className="mt-4 p-3 rounded-xl relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <h5 className="text-xs font-bold text-white truncate">{myBusiness.name}</h5>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm leading-none">{countryConfig.flag}</span>
                <span className="text-[10px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
                  {myBusiness.location.city}, {myBusiness.location.countryCode}
                </span>
              </div>
            </div>
            {myBusiness.verified && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            )}
          </div>

          <div
            className="mt-2.5 flex items-center justify-between px-2 py-1 rounded-lg text-[10px] font-semibold"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="truncate max-w-[110px]" style={{ color: '#22d3ee' }}>{myBusiness.industry}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p
          className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Operations
        </p>

        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = dashboardView === item.id;
          const accent = item.accentColor || '#6366f1';

          return (
            <button
              key={item.id}
              onClick={() => setDashboardView(item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${accent}22, ${accent}10)`,
                      border: `1px solid ${accent}35`,
                      color: '#f1f5f9',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: 'var(--text-secondary)',
                    }
              }
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: isActive ? accent : item.accentColor ? item.accentColor + '99' : 'currentColor' }}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                  style={
                    isActive
                      ? { background: `${accent}30`, color: accent }
                      : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }
                  }
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 pb-4 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.12))',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(79,70,229,0.2))';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.12))';
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Business Entity
        </button>

        <button
          onClick={() => setAppMode('landing')}
          className="w-full py-2 text-[11px] font-medium flex items-center justify-center gap-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut className="w-3.5 h-3.5" />
          Back to Directory
        </button>
      </div>
    </aside>
  );
}
