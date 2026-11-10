'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  X,
  Building2,
  User,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AccountType, BusinessModelType } from '@/types';
import { UNIVERSAL_TAXONOMY, UNIVERSAL_BUSINESS_MODELS, GLOBAL_COUNTRIES } from '@/data/taxonomy';

export function RegisterBusinessModal() {
  const {
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    registerNewAccount,
  } = useBizLink();

  const [accountType, setAccountType] = useState<AccountType>('businessman');
  const [selectedIndustry, setSelectedIndustry] = useState<string>(UNIVERSAL_TAXONOMY[0].name);
  const [selectedModel, setSelectedModel] = useState<BusinessModelType>('Hybrid (Product & Service)');
  const [selectedCountryCode, setSelectedCountryCode] = useState('US');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Austin',
    address: '',
    businessName: '',
    taxIdentifier: '',
    description: '',
  });

  const [createdSuccess, setCreatedSuccess] = useState<boolean>(false);

  if (!isRegisterModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const country = GLOBAL_COUNTRIES.find(c => c.code === selectedCountryCode);

    registerNewAccount({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      accountType: accountType,
      city: formData.city,
      country: country?.name || 'United States',
      countryCode: selectedCountryCode,
      businessName: accountType === 'businessman' ? (formData.businessName || `${formData.name}'s Enterprise`) : undefined,
      industry: accountType === 'businessman' ? selectedIndustry : undefined,
      businessModel: accountType === 'businessman' ? selectedModel : undefined,
      taxIdentifier: formData.taxIdentifier,
    });
    setCreatedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in-up">
      <div
        className="w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh] glass-card shadow-2xl"
        style={{
          background: '#080d1a',
          border: '1px solid rgba(99,102,241,0.3)',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(34,211,238,0.1) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Join Universal Business Network</h3>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                One Network. Every Business. Every Industry. Worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRegisterModalOpen(false);
              setCreatedSuccess(false);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {createdSuccess ? (
            <div className="text-center py-8 space-y-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-white">Enterprise Entity Registered & Synced!</h4>
                <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Your business profile is now active on the BizLink Universal Network and safely saved in the cloud persistent vault.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setCreatedSuccess(false);
                }}
                className="btn-primary text-xs px-6 py-2.5"
              >
                Enter Enterprise Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Type Selector */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Registration Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('businessman')}
                    className="p-3.5 rounded-2xl text-left flex items-start gap-3 transition-all"
                    style={{
                      background: accountType === 'businessman' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      border: accountType === 'businessman' ? '2px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Building2
                      className={`w-5 h-5 mt-0.5 shrink-0 ${accountType === 'businessman' ? 'text-indigo-400' : 'text-slate-500'}`}
                    />
                    <div>
                      <span className="font-bold block text-sm text-white">Enterprise / Organization</span>
                      <span className="text-[11px] font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Showcase products & services, manage deals, and build global partnerships.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className="p-3.5 rounded-2xl text-left flex items-start gap-3 transition-all"
                    style={{
                      background: accountType === 'individual' ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)',
                      border: accountType === 'individual' ? '2px solid rgba(34,211,238,0.6)' : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <User
                      className={`w-5 h-5 mt-0.5 shrink-0 ${accountType === 'individual' ? 'text-cyan-400' : 'text-slate-500'}`}
                    />
                    <div>
                      <span className="font-bold block text-sm text-white">Client / Explorer</span>
                      <span className="text-[11px] font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Discover businesses worldwide, procure goods, and hire service specialists.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Core Executive Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Vance / Dr. Elena Rostova"
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@enterprise.com"
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Business-specific Fields */}
              {accountType === 'businessman' && (
                <div className="space-y-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Business / Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Apex Autonomous Systems"
                        className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Tax / Registration ID</label>
                      <input
                        type="text"
                        value={formData.taxIdentifier}
                        onChange={e => setFormData({ ...formData, taxIdentifier: e.target.value })}
                        placeholder="e.g. EIN / VAT / GST / UEN"
                        className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 font-mono focus:outline-none"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      />
                    </div>
                  </div>

                  {/* Taxonomy & Model Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Industry Sector *</label>
                      <select
                        value={selectedIndustry}
                        onChange={e => setSelectedIndustry(e.target.value)}
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
                      <label className="block text-slate-300 font-bold mb-1">Business Model *</label>
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value as BusinessModelType)}
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
                  </div>
                </div>
              )}

              {/* Geography and Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Country</label>
                  <select
                    value={selectedCountryCode}
                    onChange={e => setSelectedCountryCode(e.target.value)}
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

                <div>
                  <label className="block text-slate-300 font-bold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Austin, TX / London / Tokyo"
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-6 py-2.5">
                  Create & Launch Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
