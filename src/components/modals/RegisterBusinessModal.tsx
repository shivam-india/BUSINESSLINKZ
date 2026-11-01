'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  X,
  Building2,
  User,
  Sparkles,
  Globe,
  Briefcase,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { AccountType, BusinessModelType } from '@/types';
import { UNIVERSAL_TAXONOMY, UNIVERSAL_BUSINESS_MODELS, GLOBAL_COUNTRIES, GLOBAL_CURRENCIES } from '@/data/taxonomy';

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
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Join Universal Business Network</h3>
              <p className="text-xs text-indigo-200 font-medium">
                One Network. Every Business. Every Industry. Worldwide.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRegisterModalOpen(false);
              setCreatedSuccess(false);
            }}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {createdSuccess ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">Enterprise Entity Registered!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your business profile is now active on the BizLink Universal Network. You can publish offerings, form cross-sector relationships, and discover partners worldwide.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setCreatedSuccess(false);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-md"
              >
                Enter Enterprise Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Type Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Registration Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType('businessman')}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      accountType === 'businessman'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mt-0.5 ${accountType === 'businessman' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-bold block text-sm">Enterprise / Organization</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Showcase products & services, manage deals, and build global partnerships.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                      accountType === 'individual'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-950 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <User className={`w-5 h-5 mt-0.5 ${accountType === 'individual' ? 'text-cyan-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-bold block text-sm">Client / Explorer</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        Discover businesses worldwide, procure goods, and hire service specialists.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Core Executive Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Vance / Dr. Elena Rostova"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@enterprise.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Business-specific Fields */}
              {accountType === 'businessman' && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Business / Brand Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Apex Autonomous Systems"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tax / Registration ID</label>
                      <input
                        type="text"
                        value={formData.taxIdentifier}
                        onChange={e => setFormData({ ...formData, taxIdentifier: e.target.value })}
                        placeholder="e.g. EIN / VAT / GST / UEN"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Taxonomy & Model Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Industry Sector *</label>
                      <select
                        value={selectedIndustry}
                        onChange={e => setSelectedIndustry(e.target.value)}
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
                      <label className="block text-slate-700 font-bold mb-1">Business Model *</label>
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value as BusinessModelType)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {UNIVERSAL_BUSINESS_MODELS.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Geography and Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country</label>
                  <select
                    value={selectedCountryCode}
                    onChange={e => setSelectedCountryCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {GLOBAL_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Austin, TX / London / Tokyo"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 012-3456"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
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
