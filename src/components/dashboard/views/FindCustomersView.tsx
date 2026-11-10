'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  Handshake,
} from 'lucide-react';
import { GLOBAL_COUNTRIES } from '@/data/taxonomy';

export function FindCustomersView() {
  const {
    businesses,
    myBusiness,
    relationships,
    connectBusinesses,
    setInspectingBusiness,
  } = useBizLink();

  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const candidateClients = businesses.filter(b => {
    if (b.id === myBusiness.id) return false;

    if (selectedIndustry !== 'all' && b.industry !== selectedIndustry) {
      return false;
    }

    if (customerSearch.trim()) {
      const q = customerSearch.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.location.city.toLowerCase().includes(q) ||
        b.location.country.toLowerCase().includes(q) ||
        b.industry.toLowerCase().includes(q) ||
        b.categories.some(c => c.toLowerCase().includes(q)) ||
        b.capabilities.some(c => c.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 pb-16">
      {/* Header Banner */}
      <div
        className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(34,211,238,0.08) 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              Client & Enterprise Procurement
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Demand Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discover Prospective Clients & Strategic Buyers
          </h1>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Expand your commercial reach. Identify enterprises, corporate sponsors, hospital networks, retailers, and institutions seeking verified products and specialized services.
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <div
        className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customerSearch}
            onChange={e => setCustomerSearch(e.target.value)}
            placeholder="Search clients by industry, capability, location, or company name..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <select
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
          className="p-2.5 rounded-xl font-bold text-white focus:outline-none cursor-pointer w-full sm:w-auto"
          style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option value="all" style={{ background: '#080d1a' }}>All Industry Sectors</option>
          {Array.from(new Set(businesses.map(b => b.industry))).map(ind => (
            <option key={ind} value={ind} style={{ background: '#080d1a' }}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Candidate Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidateClients.map((client, idx) => {
          const country = GLOBAL_COUNTRIES.find(c => c.code === client.location.countryCode) || GLOBAL_COUNTRIES[0];
          const isConnected = relationships.some(
            r =>
              (r.sourceId === myBusiness.id && r.targetId === client.id) ||
              (r.sourceId === client.id && r.targetId === myBusiness.id)
          );

          return (
            <div
              key={client.id}
              className="glass-card rounded-3xl p-5 hover-lift flex flex-col justify-between group animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${idx * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 block uppercase">
                        {client.industry}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {client.name}
                      </h4>
                    </div>
                  </div>
                  {client.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {client.tagline || client.description}
                </p>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span
                    className="px-2 py-0.5 rounded-md font-bold text-white"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    {client.primaryBusinessModel}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md text-slate-400"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {client.location.city}, {client.location.country}
                  </span>
                </div>

                {client.businessRequirements?.seekingServices && (
                  <div
                    className="p-2.5 rounded-xl text-[10px] space-y-0.5"
                    style={{
                      background: 'rgba(16,185,129,0.08)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span className="font-bold text-emerald-400 block">Seeking Services / Products:</span>
                    <p className="text-slate-300 truncate">{client.businessRequirements.seekingServices.join(', ')}</p>
                  </div>
                )}
              </div>

              <div
                className="mt-4 pt-3 flex items-center justify-between gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <button
                  onClick={() => setInspectingBusiness(client)}
                  className="btn-secondary text-xs py-1.5"
                >
                  View Profile
                </button>

                {isConnected ? (
                  <span
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => connectBusinesses(client, 'Client ↔ Service Provider')}
                    className="btn-primary text-xs py-1.5 px-3.5"
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

      {candidateClients.length === 0 && (
        <div
          className="p-16 text-center rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-cyan-400" />
          <p className="text-xs font-bold text-white">No matching clients found</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Try clearing your search query or selecting &quot;All Industry Sectors&quot;.
          </p>
        </div>
      )}
    </div>
  );
}
