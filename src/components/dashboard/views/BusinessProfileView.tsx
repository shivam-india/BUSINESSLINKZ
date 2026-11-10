'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Building2, ShieldCheck, Save, Globe } from 'lucide-react';
import { UNIVERSAL_TAXONOMY, UNIVERSAL_BUSINESS_MODELS, GLOBAL_COUNTRIES, GLOBAL_CURRENCIES } from '@/data/taxonomy';
import { BusinessModelType } from '@/types';

export function BusinessProfileView() {
  const { myBusiness, updateMyBusiness } = useBizLink();
  const [formData, setFormData] = useState({
    name: myBusiness.name,
    tagline: myBusiness.tagline || '',
    ownerName: myBusiness.ownerName,
    industry: myBusiness.industry,
    subIndustry: myBusiness.subIndustry || '',
    primaryBusinessModel: myBusiness.primaryBusinessModel,
    currency: myBusiness.currency,
    phone: myBusiness.phone,
    email: myBusiness.email,
    website: myBusiness.website || '',
    description: myBusiness.description,
    address: myBusiness.location.address,
    city: myBusiness.location.city,
    state: myBusiness.location.state,
    country: myBusiness.location.country,
    countryCode: myBusiness.location.countryCode,
    postalCode: myBusiness.location.postalCode || myBusiness.location.pincode || '',
    taxIdentifier: myBusiness.taxIdentifier || myBusiness.gstNumber || '',
    serviceScope: myBusiness.serviceCoverage.scope,
    capabilitiesStr: myBusiness.capabilities.join(', '),
    skillsStr: myBusiness.skills.join(', '),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMyBusiness({
      name: formData.name,
      tagline: formData.tagline,
      ownerName: formData.ownerName,
      industry: formData.industry,
      subIndustry: formData.subIndustry,
      primaryBusinessModel: formData.primaryBusinessModel as BusinessModelType,
      currency: formData.currency,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      description: formData.description,
      taxIdentifier: formData.taxIdentifier,
      gstNumber: formData.taxIdentifier,
      capabilities: formData.capabilitiesStr.split(',').map(s => s.trim()).filter(Boolean),
      skills: formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean),
      serviceCoverage: {
        ...myBusiness.serviceCoverage,
        scope: formData.serviceScope,
      },
      location: {
        ...myBusiness.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        countryCode: formData.countryCode,
        postalCode: formData.postalCode,
        pincode: formData.postalCode,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 pb-16">
      {/* Header Banner */}
      <div
        className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: '1px solid rgba(34,211,238,0.3)' }}
            >
              Enterprise Identity
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Verified Entity Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Universal Enterprise Profile
          </h1>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Configure your enterprise identity, industry classification, service areas, and commercial credentials. Automatically synced with persistent storage.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            ID: {myBusiness.businessCode}
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified
          </span>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Core Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">1. Corporate Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Enterprise Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Intelligent Industrial Telemetry & Machine Learning"
                  className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Executive Leader / Owner *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tax / Registration ID (EIN / VAT / GST)</label>
                <input
                  type="text"
                  value={formData.taxIdentifier}
                  onChange={e => setFormData({ ...formData, taxIdentifier: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-cyan-300 font-mono focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">About & Executive Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>
          </div>

          {/* Industry Taxonomy & Business Model */}
          <div className="space-y-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">2. Universal Industry & Model</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Primary Industry Sector</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white font-bold focus:outline-none cursor-pointer"
                  style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {UNIVERSAL_TAXONOMY.map(t => (
                    <option key={t.id} value={t.name} style={{ background: '#080d1a' }}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Primary Business Model</label>
                <select
                  value={formData.primaryBusinessModel}
                  onChange={e => setFormData({ ...formData, primaryBusinessModel: e.target.value as BusinessModelType })}
                  className="w-full p-2.5 rounded-xl text-white font-bold focus:outline-none cursor-pointer"
                  style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {UNIVERSAL_BUSINESS_MODELS.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#080d1a' }}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Operating Currency</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white font-bold focus:outline-none cursor-pointer"
                  style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {GLOBAL_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code} style={{ background: '#080d1a' }}>
                      {curr.code} ({curr.symbol}) — {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Global Location & Service Scope */}
          <div className="space-y-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400">3. Global Location & Service Coverage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-300 mb-1">Headquarters Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Country</label>
                <select
                  value={formData.countryCode}
                  onChange={e => {
                    const found = GLOBAL_COUNTRIES.find(c => c.code === e.target.value);
                    setFormData({
                      ...formData,
                      countryCode: e.target.value,
                      country: found?.name || formData.country,
                    });
                  }}
                  className="w-full p-2.5 rounded-xl text-white font-bold focus:outline-none cursor-pointer"
                  style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} style={{ background: '#080d1a' }}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Capabilities & Skills Matrix */}
          <div className="space-y-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400">4. Capabilities & Skills Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Enterprise Capabilities (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.capabilitiesStr}
                  onChange={e => setFormData({ ...formData, capabilitiesStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Domain Skills & Competencies (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.skillsStr}
                  onChange={e => setFormData({ ...formData, skillsStr: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="submit"
              className="btn-primary text-xs px-6 py-2.5"
            >
              <Save className="w-4 h-4" />
              Save & Synchronize Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
