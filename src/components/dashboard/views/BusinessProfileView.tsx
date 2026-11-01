'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Building2, MapPin, ShieldCheck, Phone, Mail, Save, Globe, Coins, Briefcase, Award } from 'lucide-react';
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
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Universal Enterprise Profile</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure your enterprise identity, industry classification, service areas, and commercial credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-3 py-1.5 bg-slate-100 rounded-xl text-slate-700 border border-slate-200">
            ID: {myBusiness.businessCode}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified
          </span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Core Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">1. Corporate Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Enterprise Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Tagline / Slogan</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Intelligent Industrial Telemetry & Machine Learning"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Executive Leader / Owner *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tax / Registration ID (EIN / VAT / GST)</label>
                <input
                  type="text"
                  value={formData.taxIdentifier}
                  onChange={e => setFormData({ ...formData, taxIdentifier: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">About & Executive Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Industry Taxonomy & Business Model */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">2. Universal Industry & Model</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Industry Sector</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {UNIVERSAL_TAXONOMY.map(t => (
                    <option key={t.id} value={t.name}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Business Model</label>
                <select
                  value={formData.primaryBusinessModel}
                  onChange={e => setFormData({ ...formData, primaryBusinessModel: e.target.value as BusinessModelType })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {UNIVERSAL_BUSINESS_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Operating Currency</label>
                <select
                  value={formData.currency}
                  onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {GLOBAL_CURRENCIES.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol}) — {curr.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Global Location & Service Scope */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">3. Global Location & Service Coverage</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Headquarters Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country</label>
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {GLOBAL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Operational Scope</label>
                <select
                  value={formData.serviceScope}
                  onChange={e => setFormData({ ...formData, serviceScope: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Global / Remote">🌐 Global / Remote Worldwide</option>
                  <option value="National">🏛️ National / Countrywide</option>
                  <option value="Regional">🗺️ Regional / Multi-City</option>
                  <option value="Local">📍 Local Radius</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Official Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Capabilities & Skills Cloud */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">4. Capabilities & Skills Matrix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Key Enterprise Capabilities (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.capabilitiesStr}
                  onChange={e => setFormData({ ...formData, capabilitiesStr: e.target.value })}
                  placeholder="e.g. ISO 9001, Rapid CNC Prototyping, 99.99% SLA"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Skills & Tools Matrix (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.skillsStr}
                  onChange={e => setFormData({ ...formData, skillsStr: e.target.value })}
                  placeholder="e.g. Python, Kubernetes, Rust, Metrology"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Universal Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
