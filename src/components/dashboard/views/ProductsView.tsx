'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Package,
  Wrench,
  Plus,
  Search,
  Sparkles,
  X,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { UniversalOffering, OfferingPricingType, ServiceDeliveryFormat } from '@/types';
import { GLOBAL_CURRENCIES, formatCurrencyAmount } from '@/data/taxonomy';

export function ProductsView() {
  const { myBusiness, addOffering, activeCurrency } = useBizLink();
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal form state
  const [offeringType, setOfferingType] = useState<'product' | 'service'>('product');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Enterprise Technology');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(1200);
  const [currency, setCurrency] = useState(activeCurrency || 'USD');
  const [pricingModel, setPricingModel] = useState<OfferingPricingType>('per_unit');

  // Product specifics
  const [moq, setMoq] = useState(1);
  const [unit, setUnit] = useState('units');
  const [isDigital, setIsDigital] = useState(false);
  const [leadTimeDays, setLeadTimeDays] = useState(3);

  // Service specifics
  const [deliveryFormat, setDeliveryFormat] = useState<ServiceDeliveryFormat>('Remote');
  const [turnaroundTime, setTurnaroundTime] = useState('1-2 weeks');
  const [deliverablesStr, setDeliverablesStr] = useState('Architecture Document, Source Code, SLA Support');

  const allOfferings = myBusiness.offerings || [];

  const filteredOfferings = allOfferings.filter(o => {
    if (filterType !== 'all' && o.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateOffering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const deliverables = deliverablesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addOffering({
      name,
      type: offeringType,
      category,
      description: description || 'Professional commercial offering.',
      price: Number(price) || 0,
      currency,
      pricingModel,
      moq: offeringType === 'product' ? Number(moq) || 1 : undefined,
      unit: offeringType === 'product' ? unit : undefined,
      inStock: true,
      leadTimeDays: offeringType === 'product' ? Number(leadTimeDays) || 1 : undefined,
      isDigital: offeringType === 'product' ? isDigital : undefined,
      deliveryFormat: offeringType === 'service' ? deliveryFormat : undefined,
      turnaroundTime: offeringType === 'service' ? turnaroundTime : undefined,
      deliverables: offeringType === 'service' ? deliverables : undefined,
      tags: [category, offeringType === 'product' ? 'Product' : 'Service'],
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 pb-16">
      {/* Header Banner */}
      <div
        className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
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
              Unified Catalogue
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Products & Services</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Enterprise Offerings & Catalogue
          </h1>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Publish, manage, and price physical hardware, digital software, and specialized professional services for discovery across the network.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-accent text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Publish New Offering
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        {/* Type Toggle Tabs */}
        <div
          className="flex items-center p-1 rounded-xl w-full sm:w-auto"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({allOfferings.length})
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filterType === 'product'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Products ({allOfferings.filter(o => o.type === 'product').length})
          </button>
          <button
            onClick={() => setFilterType('service')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filterType === 'service'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Services ({allOfferings.filter(o => o.type === 'service').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search offerings by name, skill, tag..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOfferings.map((item, idx) => {
          const isProd = item.type === 'product';
          return (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-5 hover-lift flex flex-col justify-between group animate-fade-in-up opacity-0"
              style={{
                animationDelay: `${idx * 0.05}s`,
                animationFillMode: 'forwards',
              }}
            >
              <div className="space-y-3.5">
                {/* Badges Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase flex items-center gap-1 ${
                      isProd
                        ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isProd ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                    {isProd ? (item.isDigital ? 'Digital Product' : 'Physical Product') : `${item.deliveryFormat || 'Remote'} Service`}
                  </span>

                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.description}
                  </p>
                </div>

                {/* Specifics Box */}
                {isProd ? (
                  <div
                    className="grid grid-cols-3 gap-2 p-2.5 rounded-xl text-[11px]"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-500">MOQ</span>
                      <span className="font-bold text-slate-300">{item.moq} {item.unit}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-500">Status</span>
                      <span className="font-bold text-emerald-400">Available</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase font-bold text-slate-500">Lead Time</span>
                      <span className="font-bold text-slate-300">{item.leadTimeDays}d</span>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-2.5 rounded-xl text-[11px] space-y-1"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Turnaround:</span>
                      <span className="font-bold text-cyan-300">{item.turnaroundTime || 'Agile'}</span>
                    </div>
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="text-[9px] uppercase font-bold block mb-0.5 text-slate-500">Deliverables:</span>
                        <p className="text-[10px] text-slate-300 truncate">{item.deliverables.join(' • ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div
                className="mt-4 pt-3 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Pricing Model</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-white font-mono">
                      {formatCurrencyAmount(item.price, item.currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      / {item.pricingModel.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-400">Active</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOfferings.length === 0 && (
        <div
          className="p-16 text-center rounded-3xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">No Offerings Found</h3>
          <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            You have not published any {filterType !== 'all' ? `${filterType}s` : 'offerings'} matching your criteria.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary text-xs mt-4"
          >
            Add First Offering
          </button>
        </div>
      )}

      {/* Add Offering Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            className="rounded-3xl w-full max-w-xl p-6 space-y-5 animate-fade-in-up max-h-[90vh] overflow-y-auto"
            style={{
              background: '#0d1526',
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.2)',
            }}
          >
            <div
              className="flex items-center justify-between pb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)' }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Publish Offering to Global Network</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    List products, hardware, cloud software, or professional services.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Offering Classification</label>
                <div
                  className="grid grid-cols-2 gap-2 p-1 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOfferingType('product');
                      setPricingModel('per_unit');
                    }}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      offeringType === 'product'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Product (Physical / Digital)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferingType('service');
                      setPricingModel('hourly');
                    }}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      offeringType === 'service'
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    Service & Consulting
                  </button>
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Offering Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={offeringType === 'product' ? 'e.g. Edge IoT Sensor Unit' : 'e.g. Cloud Security Architecture Audit'}
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category / Domain *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Industrial Automation / Software"
                    className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail specifications, capabilities, and business value..."
                  className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-white font-mono font-bold focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-white font-bold focus:outline-none cursor-pointer"
                    style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {GLOBAL_CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code} style={{ background: '#0d1526' }}>
                        {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Billing Model</label>
                  <select
                    value={pricingModel}
                    onChange={e => setPricingModel(e.target.value as OfferingPricingType)}
                    className="w-full p-2.5 rounded-xl text-white font-medium focus:outline-none cursor-pointer"
                    style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="per_unit" style={{ background: '#0d1526' }}>Per Unit</option>
                    <option value="hourly" style={{ background: '#0d1526' }}>Hourly Rate</option>
                    <option value="monthly_retainer" style={{ background: '#0d1526' }}>Monthly Retainer</option>
                    <option value="fixed" style={{ background: '#0d1526' }}>Fixed Project Fee</option>
                    <option value="custom_quote" style={{ background: '#0d1526' }}>Custom Quote</option>
                  </select>
                </div>
              </div>

              {/* Conditional Product / Service Details */}
              {offeringType === 'product' ? (
                <div
                  className="grid grid-cols-3 gap-3 p-3 rounded-2xl"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <div>
                    <label className="block text-indigo-300 font-bold mb-1">MOQ</label>
                    <input
                      type="number"
                      min="1"
                      value={moq}
                      onChange={e => setMoq(Number(e.target.value))}
                      className="w-full p-2 rounded-lg text-white font-mono focus:outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-300 font-bold mb-1">Unit</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      placeholder="units, crates..."
                      className="w-full p-2 rounded-lg text-white focus:outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-300 font-bold mb-1">Lead Time (Days)</label>
                    <input
                      type="number"
                      min="0"
                      value={leadTimeDays}
                      onChange={e => setLeadTimeDays(Number(e.target.value))}
                      className="w-full p-2 rounded-lg text-white font-mono focus:outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 gap-3 p-3 rounded-2xl"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}
                >
                  <div>
                    <label className="block text-cyan-300 font-bold mb-1">Delivery Format</label>
                    <select
                      value={deliveryFormat}
                      onChange={e => setDeliveryFormat(e.target.value as ServiceDeliveryFormat)}
                      className="w-full p-2 rounded-lg text-white font-bold focus:outline-none cursor-pointer"
                      style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <option value="Remote" style={{ background: '#0d1526' }}>Remote Worldwide</option>
                      <option value="On-Site" style={{ background: '#0d1526' }}>On-Site Client Facility</option>
                      <option value="Hybrid" style={{ background: '#0d1526' }}>Hybrid Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-300 font-bold mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      value={turnaroundTime}
                      onChange={e => setTurnaroundTime(e.target.value)}
                      placeholder="e.g. 2-3 weeks / Ongoing"
                      className="w-full p-2 rounded-lg text-white focus:outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-cyan-300 font-bold mb-1">Deliverables (Comma-separated)</label>
                    <input
                      type="text"
                      value={deliverablesStr}
                      onChange={e => setDeliverablesStr(e.target.value)}
                      placeholder="e.g. Architecture Blueprint, Source Code, SLA Support"
                      className="w-full p-2 rounded-lg text-white focus:outline-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>
              )}

              <div
                className="flex justify-end gap-2 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
