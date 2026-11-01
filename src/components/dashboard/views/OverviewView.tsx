'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Globe,
  Building2,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Search,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  TrendingUp,
  Package,
  Wrench,
  Handshake,
  Receipt,
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

  const recommendedPartners = businesses
    .filter(b => b.id !== myBusiness.id)
    .slice(0, 3);

  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Universal Vision Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider border border-cyan-500/30">
              Universal Business Network
            </span>
            <span className="text-xs text-slate-400">Global Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            One Network. Every Business. Worldwide.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connected across <strong>{myBusiness.industry}</strong>, engineering, logistics, creative, and consulting. Discover cross-industry partners, publish products & services, and manage commercial engagements seamlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <button
            onClick={() => setDashboardView('find_suppliers')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Universal Discovery
          </button>
          <button
            onClick={() => setDashboardView('network')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Ecosystem Graph
          </button>
        </div>
      </div>

      {/* 4 Core Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ecosystem Partners */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Connected Partners
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Handshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{relationships.length}</div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Multi-sector active mesh
            </p>
          </div>
        </div>

        {/* Published Offerings */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Offerings
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{myBusiness.offerings?.length || 0}</div>
            <p className="text-[11px] text-indigo-600 font-bold mt-1">
              {myBusiness.products?.length || 0} Products • {myBusiness.services?.length || 0} Services
            </p>
          </div>
        </div>

        {/* Commercial Receivables / Deal Flow */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Invoices / Deals
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatCurrencyAmount(totalReceivables, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Settled: {formatCurrencyAmount(totalSettled, myBusiness.currency)}
            </p>
          </div>
        </div>

        {/* Trust & Network Rating */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Network Reputation
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5 text-2xl font-black text-slate-900">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span>{myBusiness.rating}</span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              Trust Score: {myBusiness.trustScore} / 100
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recommended Strategic Connections & Deal Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Strategic Connections (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Recommended Cross-Sector Partners</h3>
              <p className="text-xs text-slate-500">Enterprises matching your technology, logistics, and service capabilities</p>
            </div>
            <button
              onClick={() => setDashboardView('find_suppliers')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Explore All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedPartners.map(biz => {
              const country = GLOBAL_COUNTRIES.find(c => c.code === biz.location.countryCode) || GLOBAL_COUNTRIES[0];
              return (
                <div
                  key={biz.id}
                  onClick={() => setInspectingBusiness(biz)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center text-lg shrink-0">
                      {country.flag}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-indigo-600">{biz.industry}</span>
                        <span className="text-[10px] text-slate-400">• {biz.location.city}, {biz.location.country}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {biz.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{biz.tagline || biz.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200">
                      {biz.primaryBusinessModel}
                    </span>
                    <button className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Commercial Engagements (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Commercial Engagements</h3>
              <button
                onClick={() => setDashboardView('transactions')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View Ledger
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Recent deals, milestones, and invoice tracking</p>

            <div className="mt-4 space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-900 truncate">{tx.customerName || tx.businessName}</p>
                    <span className="text-[10px] text-slate-400 capitalize">{tx.commercialType || 'Invoice'} • {tx.dueDate}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 block">
                      {formatCurrencyAmount(tx.amount, tx.currency || myBusiness.currency)}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        tx.status === 'Settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsAddTransactionModalOpen(true)}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Record Commercial Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
