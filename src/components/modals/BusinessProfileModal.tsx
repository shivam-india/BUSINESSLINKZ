'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  X,
  Building2,
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Package,
  Wrench,
  Award,
  Briefcase,
  Handshake,
  Receipt,
  Navigation,
} from 'lucide-react';
import { GLOBAL_COUNTRIES, UNIVERSAL_RELATIONSHIP_TYPES, formatCurrencyAmount } from '@/data/taxonomy';
import { UniversalRelationshipType } from '@/types';

export function BusinessProfileModal() {
  const {
    inspectingBusiness,
    setInspectingBusiness,
    myBusiness,
    connectBusinesses,
    relationships,
    showToast,
    setIsAddTransactionModalOpen,
    setPrefilledTxBusiness,
  } = useBizLink();

  const [activeTab, setActiveTab] = useState<'about' | 'offerings' | 'capabilities' | 'credentials' | 'network'>('about');
  const [selectedRelType, setSelectedRelType] = useState<UniversalRelationshipType>('Strategic Partner ↔ Partner');

  if (!inspectingBusiness) return null;

  const isMyBusiness = inspectingBusiness.id === myBusiness.id;
  const existingRel = relationships.find(
    r =>
      (r.sourceId === myBusiness.id && r.targetId === inspectingBusiness.id) ||
      (r.sourceId === inspectingBusiness.id && r.targetId === myBusiness.id)
  );

  const country = GLOBAL_COUNTRIES.find(c => c.code === inspectingBusiness.location.countryCode) || GLOBAL_COUNTRIES[0];

  const handleOpenDeals = () => {
    setPrefilledTxBusiness(inspectingBusiness);
    setIsAddTransactionModalOpen(true);
    setInspectingBusiness(null);
  };

  const mapsNavUrl =
    inspectingBusiness.directionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      inspectingBusiness.name + ' ' + inspectingBusiness.location.city
    )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in-up">
      <div
        className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh] glass-card shadow-2xl"
        style={{
          background: '#080d1a',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.15)',
        }}
      >
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden shrink-0" style={{ background: 'rgba(13,21,38,0.95)' }}>
          {inspectingBusiness.imageUrl && (
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <img
                src={inspectingBusiness.imageUrl}
                alt={inspectingBusiness.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div
            className="relative p-6"
            style={{
              background: 'linear-gradient(to top, #080d1a 0%, rgba(13,21,38,0.8) 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              onClick={() => setInspectingBusiness(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.08)' }}
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-xl"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {country.flag}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
                    >
                      {inspectingBusiness.businessCode}
                    </span>
                    <span className="text-xs font-bold text-indigo-300">
                      {inspectingBusiness.industry}
                    </span>
                    {inspectingBusiness.verified && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Enterprise
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {inspectingBusiness.name}
                  </h1>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {inspectingBusiness.location.city}, {inspectingBusiness.location.country}
                    </span>
                    <span>•</span>
                    <span className="text-cyan-300 font-semibold">{inspectingBusiness.primaryBusinessModel}</span>
                    <span>•</span>
                    <span>Est. {inspectingBusiness.establishedYear}</span>
                  </div>
                </div>
              </div>

              {/* Trust Score Card */}
              <div
                className="rounded-2xl p-3 text-right shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-1 text-amber-400 font-black text-lg justify-end">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{inspectingBusiness.rating}</span>
                  <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {inspectingBusiness.reviewCount} Network Reviews
                </p>
                <div className="mt-1 text-[10px] text-emerald-400 font-bold">
                  Trust Score: {inspectingBusiness.trustScore}/100
                </div>
              </div>
            </div>

            {/* Top Action Bar */}
            <div
              className="mt-4 pt-4 flex flex-wrap items-center justify-between gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Business Models:</span>
                {inspectingBusiness.businessModels.map(m => (
                  <span
                    key={m}
                    className="px-2.5 py-0.5 rounded-lg text-xs font-bold text-white"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={mapsNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  Google Maps
                </a>

                <button
                  onClick={handleOpenDeals}
                  className="btn-accent text-xs py-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  Record Deal / Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          className="px-6 flex items-center gap-6 text-xs sm:text-sm font-bold overflow-x-auto shrink-0"
          style={{
            background: 'rgba(8,13,26,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Overview & Markets
          </button>

          <button
            onClick={() => setActiveTab('offerings')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'offerings'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Offerings ({inspectingBusiness.offerings?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('capabilities')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'capabilities'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Capabilities & Skills
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'credentials'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            Certifications & Portfolio
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'network'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Handshake className="w-4 h-4" />
            Network & Partnerships
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tab 1: About */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Executive Overview</h4>
                <p className="text-sm leading-relaxed mt-1 text-slate-300">{inspectingBusiness.description}</p>
              </div>

              {/* Geographic Coverage & Target Markets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    Service Coverage & Distribution Scope
                  </span>
                  <div className="text-xs text-slate-300 space-y-1">
                    <p>
                      <strong className="text-white">Operational Scope:</strong> {inspectingBusiness.serviceCoverage.scope}
                    </p>
                    {inspectingBusiness.serviceCoverage.regionsOrCountriesServed && (
                      <p>
                        <strong className="text-white">Regions Served:</strong>{' '}
                        {inspectingBusiness.serviceCoverage.regionsOrCountriesServed.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    Target Markets & Industry Sectors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingBusiness.businessRequirements?.targetMarkets ? (
                      inspectingBusiness.businessRequirements.targetMarkets.map(m => (
                        <span
                          key={m}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Commercial Enterprises worldwide</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact & Registration Information */}
              <div
                className="p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">Corporate Phone</span>
                  <span className="font-bold text-white">{inspectingBusiness.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">Official Email</span>
                  <span className="font-bold text-white">{inspectingBusiness.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold text-[10px] uppercase">Tax / Business ID</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {inspectingBusiness.taxIdentifier || inspectingBusiness.gstNumber || 'Registered'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Offerings */}
          {activeTab === 'offerings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Universal Catalogue ({inspectingBusiness.offerings?.length || 0})
                </h4>
                <span className="text-xs text-cyan-400 font-bold">
                  Operating in {inspectingBusiness.currency}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inspectingBusiness.offerings && inspectingBusiness.offerings.length > 0 ? (
                  inspectingBusiness.offerings.map(off => {
                    const isProd = off.type === 'product';
                    return (
                      <div
                        key={off.id}
                        className="p-4 rounded-2xl flex flex-col justify-between"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${
                                isProd
                                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                                  : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                              }`}
                            >
                              {isProd ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                              {isProd ? 'Product' : 'Service'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{off.category}</span>
                          </div>

                          <h5 className="text-sm font-bold text-white">{off.name}</h5>
                          <p className="text-xs text-slate-300 line-clamp-2">{off.description}</p>

                          {isProd ? (
                            <div
                              className="text-[11px] text-slate-300 p-2 rounded-xl flex justify-between"
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                              <span>MOQ: {off.moq} {off.unit}</span>
                              <span>Lead: {off.leadTimeDays}d</span>
                              <span className="text-emerald-400 font-bold">In Stock</span>
                            </div>
                          ) : (
                            <div
                              className="text-[11px] text-slate-300 p-2 rounded-xl space-y-0.5"
                              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                              <div>Delivery: <strong className="text-white">{off.deliveryFormat || 'Remote'}</strong></div>
                              <div>Turnaround: <strong className="text-white">{off.turnaroundTime}</strong></div>
                            </div>
                          )}
                        </div>

                        <div
                          className="mt-3 pt-2.5 flex items-center justify-between"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <span className="text-base font-black text-cyan-300 font-mono">
                            {formatCurrencyAmount(off.price, off.currency)}
                          </span>
                          <span className="text-xs text-slate-400 capitalize">
                            / {off.pricingModel.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic">No catalogue listings published yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Capabilities & Skills */}
          {activeTab === 'capabilities' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Enterprise Capabilities & Operating Standards
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspectingBusiness.capabilities?.map((cap, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-200"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Specialized Skills, Tools & Domain Competencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {inspectingBusiness.skills?.map((sk, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-300"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Credentials & Portfolio */}
          {activeTab === 'credentials' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Audited Certifications & Credentials
                </h4>
                <div className="space-y-2">
                  {inspectingBusiness.certifications && inspectingBusiness.certifications.length > 0 ? (
                    inspectingBusiness.certifications.map(c => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl flex items-center justify-between text-xs"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <p className="font-bold text-white">{c.name}</p>
                            <p className="text-[10px] text-slate-400">Issued by {c.issuingBody} ({c.year})</p>
                          </div>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                        >
                          Verified
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No certifications submitted.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Showcase Projects & Deliverables
                </h4>
                <div className="space-y-3">
                  {inspectingBusiness.portfolio && inspectingBusiness.portfolio.length > 0 ? (
                    inspectingBusiness.portfolio.map(p => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl space-y-1 text-xs"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-white">{p.title}</h5>
                          <span className="text-[10px] text-slate-500">{p.year}</span>
                        </div>
                        {p.clientOrSector && (
                          <span className="text-[11px] font-semibold text-cyan-300 block">
                            Client/Sector: {p.clientOrSector}
                          </span>
                        )}
                        <p className="text-slate-300 leading-relaxed">{p.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No case studies listed yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Network & Partnerships */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              {existingRel ? (
                <div
                  className="p-4 rounded-2xl space-y-2"
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-300 text-sm flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-cyan-400" />
                      Connected: {existingRel.relationshipType}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
                    >
                      Active Link
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{existingRel.category}</p>
                </div>
              ) : !isMyBusiness ? (
                <div
                  className="p-4 rounded-2xl space-y-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <h4 className="text-xs font-bold text-white uppercase">Form a Professional Connection</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Relationship Type</label>
                      <select
                        value={selectedRelType}
                        onChange={e => setSelectedRelType(e.target.value as UniversalRelationshipType)}
                        className="w-full p-2.5 rounded-xl text-xs text-white font-medium focus:outline-none cursor-pointer"
                        style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                          <option key={rel.id} value={rel.id} style={{ background: '#080d1a' }}>
                            {rel.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => connectBusinesses(inspectingBusiness, selectedRelType)}
                        className="btn-accent w-full text-xs py-2.5"
                      >
                        Establish Ecosystem Connection
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Requirements & Synergies */}
              {inspectingBusiness.businessRequirements && (
                <div
                  className="p-4 rounded-2xl space-y-3 text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <h4 className="font-bold text-white uppercase">Partnership Synergies & Requirements</h4>
                  {inspectingBusiness.businessRequirements.lookingForPartnerships && (
                    <div>
                      <span className="font-semibold text-indigo-300 block">Looking for Partners:</span>
                      <p className="text-slate-300 mt-0.5">
                        {inspectingBusiness.businessRequirements.lookingForPartnerships.join(', ')}
                      </p>
                    </div>
                  )}
                  {inspectingBusiness.businessRequirements.seekingServices && (
                    <div>
                      <span className="font-semibold text-cyan-300 block">Seeking Services:</span>
                      <p className="text-slate-300 mt-0.5">
                        {inspectingBusiness.businessRequirements.seekingServices.join(', ')}
                      </p>
                    </div>
                  )}
                  {inspectingBusiness.businessRequirements.seekingProductsOrSuppliers && (
                    <div>
                      <span className="font-semibold text-amber-300 block">Seeking Suppliers / Products:</span>
                      <p className="text-slate-300 mt-0.5">
                        {inspectingBusiness.businessRequirements.seekingProductsOrSuppliers.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
