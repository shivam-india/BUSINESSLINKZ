'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Users,
  Search,
  MapPin,
  Building2,
  Plus,
  ShieldCheck,
  Star,
  CheckCircle2,
  ExternalLink,
  Phone,
  Send,
  Globe,
  Briefcase,
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
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-teal-800/40">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
              Client & Enterprise Procurement Discovery
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Discover Prospective Clients & Strategic Buyers
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Expand your commercial reach. Identify enterprises, corporate sponsors, hospital networks, retailers, and institutions seeking verified products, tech infrastructure, and specialized services.
          </p>
        </div>
      </div>

      {/* Search Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customerSearch}
            onChange={e => setCustomerSearch(e.target.value)}
            placeholder="Search clients by industry, capability, location, or company name..."
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <select
          value={selectedIndustry}
          onChange={e => setSelectedIndustry(e.target.value)}
          className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 w-full sm:w-auto"
        >
          <option value="all">All Industry Sectors</option>
          {Array.from(new Set(businesses.map(b => b.industry))).map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Candidate Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidateClients.map(client => {
          const country = GLOBAL_COUNTRIES.find(c => c.code === client.location.countryCode) || GLOBAL_COUNTRIES[0];
          const isConnected = relationships.some(
            r =>
              (r.sourceId === myBusiness.id && r.targetId === client.id) ||
              (r.sourceId === client.id && r.targetId === myBusiness.id)
          );

          return (
            <div
              key={client.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{country.flag}</span>
                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 block uppercase">
                        {client.industry}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {client.name}
                      </h4>
                    </div>
                  </div>
                  {client.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {client.tagline || client.description}
                </p>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
                    {client.primaryBusinessModel}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-500 border border-slate-200">
                    {client.location.city}, {client.location.country}
                  </span>
                </div>

                {client.businessRequirements?.seekingServices && (
                  <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[10px] text-emerald-900">
                    <span className="font-bold block">Seeking Services / Products:</span>
                    <p className="text-emerald-800 truncate">{client.businessRequirements.seekingServices.join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setInspectingBusiness(client)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  View Profile
                </button>

                {isConnected ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => connectBusinesses(client, 'Client ↔ Service Provider')}
                    className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1"
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
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">No matching clients found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Try clearing your search query or selecting &quot;All Industry Sectors&quot;.</p>
        </div>
      )}
    </div>
  );
}
