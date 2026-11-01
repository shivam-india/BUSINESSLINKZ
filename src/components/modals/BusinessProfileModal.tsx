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
  Layers,
  Award,
  Briefcase,
  Handshake,
  ExternalLink,
  Tag,
  Receipt,
  Navigation,
  Send,
  Sparkles,
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
  const [inquiryText, setInquiryText] = useState('');
  const [isInquirySent, setIsInquirySent] = useState(false);
  const [selectedRelType, setSelectedRelType] = useState<UniversalRelationshipType>('Strategic Partner ↔ Partner');

  if (!inspectingBusiness) return null;

  const isMyBusiness = inspectingBusiness.id === myBusiness.id;
  const existingRel = relationships.find(
    r =>
      (r.sourceId === myBusiness.id && r.targetId === inspectingBusiness.id) ||
      (r.sourceId === inspectingBusiness.id && r.targetId === myBusiness.id)
  );

  const country = GLOBAL_COUNTRIES.find(c => c.code === inspectingBusiness.location.countryCode) || GLOBAL_COUNTRIES[0];

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setIsInquirySent(true);
    showToast('Inquiry Dispatched', `Direct message sent to ${inspectingBusiness.name}. Response expected shortly.`, 'success');
    setTimeout(() => {
      setInquiryText('');
      setIsInquirySent(false);
    }, 2500);
  };

  const handleOpenDeals = () => {
    setPrefilledTxBusiness(inspectingBusiness);
    setIsAddTransactionModalOpen(true);
    setInspectingBusiness(null);
  };

  const mapsNavUrl = inspectingBusiness.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inspectingBusiness.name + ' ' + inspectingBusiness.location.city)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Hero Banner */}
        <div className="relative bg-slate-950 text-white overflow-hidden shrink-0">
          {inspectingBusiness.imageUrl && (
            <div className="absolute inset-0 opacity-25 mix-blend-overlay">
              <img
                src={inspectingBusiness.imageUrl}
                alt={inspectingBusiness.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="relative p-6 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
            <button
              onClick={() => setInspectingBusiness(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/20 shadow-xl shrink-0 flex items-center justify-center text-2xl font-black text-cyan-400">
                  {country.flag}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {inspectingBusiness.businessCode}
                    </span>
                    <span className="text-xs font-bold text-indigo-300">
                      {inspectingBusiness.industry}
                    </span>
                    {inspectingBusiness.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified Enterprise
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {inspectingBusiness.name}
                  </h1>

                  <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
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
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-right shrink-0">
                <div className="flex items-center gap-1 text-amber-300 font-black text-lg justify-end">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span>{inspectingBusiness.rating}</span>
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium">
                  {inspectingBusiness.reviewCount} Network Reviews
                </p>
                <div className="mt-1 text-[10px] text-emerald-400 font-bold">
                  Trust Score: {inspectingBusiness.trustScore}/100
                </div>
              </div>
            </div>

            {/* Top Action Bar */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-bold uppercase">Business Models:</span>
                {inspectingBusiness.businessModels.map(m => (
                  <span key={m} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white text-slate-900">
                    {m}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Google Maps Directions */}
                <a
                  href={mapsNavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Google Maps
                </a>

                {/* Commercial Deal / Invoice */}
                <button
                  onClick={handleOpenDeals}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  Record Deal / Invoice
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'about' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
          >
            <Building2 className="w-4 h-4" />
            Overview & Markets
          </button>

          <button
            onClick={() => setActiveTab('offerings')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'offerings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
          >
            <Package className="w-4 h-4" />
            Offerings ({inspectingBusiness.offerings?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('capabilities')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'capabilities' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
          >
            <Wrench className="w-4 h-4" />
            Capabilities & Skills
          </button>

          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'credentials' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
          >
            <Award className="w-4 h-4" />
            Certifications & Portfolio
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'network' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
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
                <p className="text-sm text-slate-700 leading-relaxed mt-1">{inspectingBusiness.description}</p>
              </div>

              {/* Geographic Coverage & Target Markets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    Service Coverage & Distribution Scope
                  </span>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>
                      <strong className="text-slate-800">Operational Scope:</strong> {inspectingBusiness.serviceCoverage.scope}
                    </p>
                    {inspectingBusiness.serviceCoverage.regionsOrCountriesServed && (
                      <p>
                        <strong className="text-slate-800">Regions Served:</strong>{' '}
                        {inspectingBusiness.serviceCoverage.regionsOrCountriesServed.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-cyan-600" />
                    Target Markets & Industry Sectors
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {inspectingBusiness.businessRequirements?.targetMarkets ? (
                      inspectingBusiness.businessRequirements.targetMarkets.map(m => (
                        <span key={m} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Commercial Enterprises worldwide</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact & Registration Information */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Corporate Phone</span>
                  <span className="font-bold text-slate-800">{inspectingBusiness.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Official Email</span>
                  <span className="font-bold text-slate-800">{inspectingBusiness.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Tax / Business ID</span>
                  <span className="font-mono font-bold text-slate-800">{inspectingBusiness.taxIdentifier || inspectingBusiness.gstNumber || 'Registered'}</span>
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
                <span className="text-xs text-slate-500">
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
                        className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${isProd ? 'bg-indigo-50 text-indigo-700' : 'bg-cyan-50 text-cyan-700'
                                }`}
                            >
                              {isProd ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                              {isProd ? 'Product' : 'Service'}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{off.category}</span>
                          </div>

                          <h5 className="text-sm font-bold text-slate-900">{off.name}</h5>
                          <p className="text-xs text-slate-500 line-clamp-2">{off.description}</p>

                          {isProd ? (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl flex justify-between">
                              <span>MOQ: {off.moq} {off.unit}</span>
                              <span>Lead: {off.leadTimeDays}d</span>
                              <span className="text-emerald-600 font-bold">In Stock</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl space-y-0.5">
                              <div>Delivery: <strong className="text-slate-800">{off.deliveryFormat || 'Remote'}</strong></div>
                              <div>Turnaround: <strong className="text-slate-800">{off.turnaroundTime}</strong></div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-base font-black text-slate-900">
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
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
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
                    <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold">
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
              {/* Certifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Audited Certifications & Credentials
                </h4>
                <div className="space-y-2">
                  {inspectingBusiness.certifications && inspectingBusiness.certifications.length > 0 ? (
                    inspectingBusiness.certifications.map(c => (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <Award className="w-4 h-4 text-amber-500 shrink-0" />
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-[10px] text-slate-500">Issued by {c.issuingBody} ({c.year})</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No certifications submitted.</p>
                  )}
                </div>
              </div>

              {/* Portfolio */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Showcase Projects & Deliverables
                </h4>
                <div className="space-y-3">
                  {inspectingBusiness.portfolio && inspectingBusiness.portfolio.length > 0 ? (
                    inspectingBusiness.portfolio.map(p => (
                      <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900">{p.title}</h5>
                          <span className="text-[10px] text-slate-400">{p.year}</span>
                        </div>
                        {p.clientOrSector && (
                          <span className="text-[11px] font-semibold text-indigo-600 block">
                            Client/Sector: {p.clientOrSector}
                          </span>
                        )}
                        <p className="text-slate-600 leading-relaxed">{p.description}</p>
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
              {/* Existing Relationship Status */}
              {existingRel ? (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-900 text-sm flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-indigo-600" />
                      Connected: {existingRel.relationshipType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Active Link
                    </span>
                  </div>
                  <p className="text-xs text-indigo-800">{existingRel.category}</p>
                </div>
              ) : !isMyBusiness ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Form a Professional Connection</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Relationship Type</label>
                      <select
                        value={selectedRelType}
                        onChange={e => setSelectedRelType(e.target.value as UniversalRelationshipType)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                      >
                        {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                          <option key={rel.id} value={rel.id}>{rel.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => connectBusinesses(inspectingBusiness, selectedRelType)}
                        className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-indigo-700 hover:to-blue-700"
                      >
                        Establish Ecosystem Connection
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Requirements & Synergies */}
              {inspectingBusiness.businessRequirements && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase">Partnership Synergies & Requirements</h4>
                  {inspectingBusiness.businessRequirements.lookingForPartnerships && (
                    <div>
                      <span className="font-semibold text-slate-700 block">Looking for Partners:</span>
                      <p className="text-slate-600 mt-0.5">{inspectingBusiness.businessRequirements.lookingForPartnerships.join(', ')}</p>
                    </div>
                  )}
                  {inspectingBusiness.businessRequirements.seekingServices && (
                    <div>
                      <span className="font-semibold text-slate-700 block">Seeking Services:</span>
                      <p className="text-slate-600 mt-0.5">{inspectingBusiness.businessRequirements.seekingServices.join(', ')}</p>
                    </div>
                  )}
                  {inspectingBusiness.businessRequirements.seekingProductsOrSuppliers && (
                    <div>
                      <span className="font-semibold text-slate-700 block">Seeking Suppliers / Products:</span>
                      <p className="text-slate-600 mt-0.5">{inspectingBusiness.businessRequirements.seekingProductsOrSuppliers.join(', ')}</p>
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
