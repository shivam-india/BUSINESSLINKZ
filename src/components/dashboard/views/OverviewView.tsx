'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Globe,
  Users,
  Plus,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  TrendingUp,
  Package,
  Handshake,
  Receipt,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { formatCurrencyAmount, GLOBAL_COUNTRIES } from '@/data/taxonomy';

export function OverviewView() {
  const {
    myBusiness,
    businesses,
    transactions,
    relationships,
    activeCurrency,
    setDashboardView,
    setInspectingBusiness,
    setIsAddTransactionModalOpen,
  } = useBizLink();

  const totalReceivables = transactions
    .filter(t => t.type === 'Debit' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSettled = transactions
    .filter(t => t.status === 'Settled')
    .reduce((sum, t) => sum + t.amount, 0);

  const recommendedPartners = businesses.filter(b => b.id !== myBusiness.id).slice(0, 3);
  const recentTransactions = transactions.slice(0, 4);

  const METRICS = [
    {
      label: 'Connected Partners',
      value: relationships.length,
      sub: 'Multi-sector active mesh',
      subColor: '#10b981',
      icon: Handshake,
      accent: '#6366f1',
      glow: 'rgba(99,102,241,0.15)',
    },
    {
      label: 'Active Offerings',
      value: myBusiness.offerings?.length || 0,
      sub: `${myBusiness.products?.length || 0} Products · ${myBusiness.services?.length || 0} Services`,
      subColor: '#22d3ee',
      icon: Package,
      accent: '#22d3ee',
      glow: 'rgba(34,211,238,0.12)',
    },
    {
      label: 'Pending Invoices',
      value: formatCurrencyAmount(totalReceivables, myBusiness.currency),
      sub: `Settled: ${formatCurrencyAmount(totalSettled, myBusiness.currency)}`,
      subColor: '#f59e0b',
      icon: Receipt,
      accent: '#f59e0b',
      glow: 'rgba(245,158,11,0.12)',
    },
    {
      label: 'Network Reputation',
      value: myBusiness.rating ? `★ ${myBusiness.rating}` : '—',
      sub: `Trust Score: ${myBusiness.trustScore || 0}/100`,
      subColor: '#10b981',
      icon: ShieldCheck,
      accent: '#10b981',
      glow: 'rgba(16,185,129,0.12)',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-5 pb-10">

      {/* ── Hero Banner ── */}
      <div
        className="rounded-3xl p-7 sm:p-9 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.08) 50%, rgba(34,211,238,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 0 60px rgba(99,102,241,0.08)',
        }}
      >
        {/* Ambient */}
        <div
          className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(34,211,238,0.07)', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: 'rgba(99,102,241,0.08)', transform: 'translate(-30%, 30%)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                style={{ background: 'rgba(34,211,238,0.12)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.2)' }}
              >
                Universal Business Network
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Global Command Center</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none">
              One Network.<br />
              <span className="gradient-text">Every Business. Worldwide.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Connected across <strong className="text-white">{myBusiness.industry}</strong> and cross-sector.
              Discover partners, publish offerings, and manage commercial engagements globally.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => setDashboardView('find_suppliers')}
              className="btn-accent text-xs"
            >
              <Globe className="w-4 h-4" />
              Universal Discovery
            </button>
            <button
              onClick={() => setDashboardView('network')}
              className="btn-secondary text-xs"
            >
              <Layers className="w-4 h-4" style={{ color: '#8b5cf6' }} />
              Ecosystem Graph
            </button>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map(({ label, value, sub, subColor, icon: Icon, accent, glow }) => (
          <div
            key={label}
            className="stat-card glass-card group cursor-default"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[20px]"
              style={{ background: `radial-gradient(circle at top right, ${glow}, transparent 60%)` }}
            />

            <div className="relative z-10 flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {label}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
              >
                <Icon className="w-4 h-4" style={{ color: accent }} />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-2xl font-black text-white leading-none">{value}</div>
              <p className="text-[11px] mt-1.5 font-semibold" style={{ color: subColor }}>
                {sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-Column Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recommended Partners — 2/3 width */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Recommended Cross-Sector Partners</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Enterprises matching your capabilities and service profile
              </p>
            </div>
            <button
              onClick={() => setDashboardView('find_suppliers')}
              className="flex items-center gap-1 text-xs font-bold transition-colors"
              style={{ color: '#6366f1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
            >
              Explore All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedPartners.map((biz, i) => {
              const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
              return (
                <button
                  key={biz.id}
                  onClick={() => setInspectingBusiness(biz)}
                  className="w-full text-left p-4 rounded-2xl transition-all duration-200 group flex items-center justify-between gap-4 animate-fade-in-up opacity-0"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: 'forwards',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.055)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.2)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {country.flag}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[10px] font-bold" style={{ color: '#6366f1' }}>{biz.industry}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          · {biz.location.city}, {biz.location.country}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {biz.name}
                      </h4>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {biz.tagline || biz.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="hidden sm:inline px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {biz.primaryBusinessModel}
                    </span>
                    <div
                      className="p-2 rounded-xl transition-colors"
                      style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Commercial Engagements — 1/3 width */}
        <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Commercial Ledger</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Recent deals & invoices</p>
            </div>
            <button
              onClick={() => setDashboardView('transactions')}
              className="text-xs font-bold transition-colors"
              style={{ color: '#6366f1' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6366f1')}
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-2">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" style={{ color: 'var(--text-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No transactions yet</p>
              </div>
            ) : (
              recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl flex items-center justify-between gap-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{tx.customerName || tx.businessName}</p>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {tx.commercialType || 'Invoice'} · {tx.dueDate}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-white block">
                      {formatCurrencyAmount(tx.amount, tx.currency || myBusiness.currency)}
                    </span>
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                      style={
                        tx.status === 'Settled'
                          ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                          : { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
                      }
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setIsAddTransactionModalOpen(true)}
            className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#a5b4fc',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Record Transaction
          </button>
        </div>
      </div>

      {/* ── Quick Actions Bar ── */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Quick Actions
          </span>
          <div className="flex flex-wrap gap-2 flex-1">
            {[
              { label: 'Add Offering', view: 'products' as const, icon: Package, color: '#22d3ee' },
              { label: 'Find Partners', view: 'find_suppliers' as const, icon: Globe, color: '#6366f1' },
              { label: 'View Network', view: 'network' as const, icon: Layers, color: '#8b5cf6' },
              { label: 'Trust Score', view: 'reviews' as const, icon: Star, color: '#f59e0b' },
            ].map(({ label, view, icon: Icon, color }) => (
              <button
                key={label}
                onClick={() => setDashboardView(view)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: `${color}10`,
                  border: `1px solid ${color}25`,
                  color: color,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${color}20`;
                  e.currentTarget.style.borderColor = `${color}40`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${color}10`;
                  e.currentTarget.style.borderColor = `${color}25`;
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
