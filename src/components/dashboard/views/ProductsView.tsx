'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Package,
  Wrench,
  Plus,
  Search,
  Tag,
  Check,
  Globe,
  Clock,
  Layers,
  Sparkles,
  FileText,
  DollarSign,
  AlertCircle,
  X,
  Building2,
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Universal Offerings & Catalogue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Publish, manage, and price tangible products and specialized professional services for discovery across the network.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Publish New Offering
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Type Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Offerings ({allOfferings.length})
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filterType === 'product' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Products ({allOfferings.filter(o => o.type === 'product').length})
          </button>
          <button
            onClick={() => setFilterType('service')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filterType === 'service' ? 'bg-white text-cyan-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Services ({allOfferings.filter(o => o.type === 'service').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search offerings by name, skill, tag..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOfferings.map(item => {
          const isProd = item.type === 'product';
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Badges Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase flex items-center gap-1 ${
                      isProd
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    }`}
                  >
                    {isProd ? <Package className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                    {isProd ? (item.isDigital ? 'Digital Product' : 'Physical Product') : `${item.deliveryFormat || 'Remote'} Service`}
                  </span>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {item.category}
                  </span>
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Specifics Box */}
                {isProd ? (
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">MOQ</span>
                      <span className="font-bold text-slate-700">{item.moq} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Stock</span>
                      <span className="font-bold text-emerald-600">In Stock</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Lead Time</span>
                      <span className="font-bold text-slate-700">{item.leadTimeDays}d</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Turnaround:</span>
                      <span className="font-bold text-slate-700">{item.turnaroundTime || 'Agile'}</span>
                    </div>
                    {item.deliverables && item.deliverables.length > 0 && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 text-[9px] uppercase font-bold block mb-0.5">Key Deliverables:</span>
                        <p className="text-[10px] text-slate-600 truncate">{item.deliverables.join(' • ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price & Action Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pricing Model</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900">
                      {formatCurrencyAmount(item.price, item.currency)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      / {item.pricingModel.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-bold text-slate-600">Active Listing</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOfferings.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No Offerings Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You have not published any {filterType !== 'all' ? `${filterType}s` : 'offerings'} matching your search criteria yet.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
          >
            Add Your First Offering
          </button>
        </div>
      )}

      {/* Add Offering Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Publish Offering to Global Network</h3>
                  <p className="text-xs text-slate-500">List products, hardware, cloud software, or professional services.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Offering Classification</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setOfferingType('product');
                      setPricingModel('per_unit');
                    }}
                    className={`py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                      offeringType === 'product' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
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
                      offeringType === 'service' ? 'bg-white text-cyan-700 shadow-xs' : 'text-slate-500'
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
                  <label className="block text-slate-700 font-bold mb-1">Offering Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={offeringType === 'product' ? 'e.g. Edge IoT Sensor Unit' : 'e.g. Cloud Security Architecture Audit'}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category / Domain *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. Industrial Automation / Software"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail specifications, capabilities, and business value..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price Amount</label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-bold"
                  >
                    {GLOBAL_CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.code} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Billing Model</label>
                  <select
                    value={pricingModel}
                    onChange={e => setPricingModel(e.target.value as OfferingPricingType)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                  >
                    <option value="per_unit">Per Unit</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="monthly_retainer">Monthly Retainer</option>
                    <option value="fixed">Fixed Project Fee</option>
                    <option value="custom_quote">Custom Quote</option>
                  </select>
                </div>
              </div>

              {/* Conditional Product / Service Details */}
              {offeringType === 'product' ? (
                <div className="grid grid-cols-3 gap-3 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Min Order Qty (MOQ)</label>
                    <input
                      type="number"
                      min="1"
                      value={moq}
                      onChange={e => setMoq(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Packaging Unit</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      placeholder="e.g. units, crates, licenses"
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-900 font-bold mb-1">Lead Time (Days)</label>
                    <input
                      type="number"
                      min="0"
                      value={leadTimeDays}
                      onChange={e => setLeadTimeDays(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-indigo-200 rounded-lg text-slate-900 font-mono"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 bg-cyan-50/50 p-3 rounded-2xl border border-cyan-100">
                  <div>
                    <label className="block text-cyan-900 font-bold mb-1">Delivery Format</label>
                    <select
                      value={deliveryFormat}
                      onChange={e => setDeliveryFormat(e.target.value as ServiceDeliveryFormat)}
                      className="w-full p-2 bg-white border border-cyan-200 rounded-lg text-slate-900 font-bold"
                    >
                      <option value="Remote">Remote Worldwide</option>
                      <option value="On-Site">On-Site Client Facility</option>
                      <option value="Hybrid">Hybrid Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-cyan-900 font-bold mb-1">Turnaround Time</label>
                    <input
                      type="text"
                      value={turnaroundTime}
                      onChange={e => setTurnaroundTime(e.target.value)}
                      placeholder="e.g. 2-3 weeks / Ongoing"
                      className="w-full p-2 bg-white border border-cyan-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-cyan-900 font-bold mb-1">Key Deliverables (Comma-separated)</label>
                    <input
                      type="text"
                      value={deliverablesStr}
                      onChange={e => setDeliverablesStr(e.target.value)}
                      placeholder="e.g. Full report, Figma files, Deployment, SLA"
                      className="w-full p-2 bg-white border border-cyan-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-md"
                >
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
