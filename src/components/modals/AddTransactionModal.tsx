'use client';

import React, { useState, useEffect } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  X,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  Building2,
  Calendar,
  FileText,
  Handshake,
} from 'lucide-react';
import { TransactionCommercialType } from '@/types';
import { GLOBAL_CURRENCIES } from '@/data/taxonomy';

export function AddTransactionModal() {
  const {
    isAddTransactionModalOpen,
    setIsAddTransactionModalOpen,
    businesses,
    addTransaction,
    prefilledTxBusiness,
    setPrefilledTxBusiness,
    activeCurrency,
    myBusiness,
  } = useBizLink();

  const [txType, setTxType] = useState<'Credit' | 'Debit'>('Debit');
  const [commercialType, setCommercialType] = useState<TransactionCommercialType>('Invoice');
  const [currency, setCurrency] = useState(activeCurrency || myBusiness.currency || 'USD');
  const [partnerMode, setPartnerMode] = useState<'select' | 'custom'>('select');
  const [selectedBizId, setSelectedBizId] = useState(businesses[1]?.id || '');
  const [customPartnerName, setCustomPartnerName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().substring(7)}`);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [category, setCategory] = useState('Enterprise Commercial Agreement');
  const [paymentMode, setPaymentMode] = useState<any>('Wire / SWIFT');

  useEffect(() => {
    if (prefilledTxBusiness) {
      setSelectedBizId(prefilledTxBusiness.id);
      setPartnerMode('select');
      setDescription(`Commercial contract milestone with ${prefilledTxBusiness.name}`);
      setCurrency(prefilledTxBusiness.currency || activeCurrency);
    }
  }, [prefilledTxBusiness, activeCurrency]);

  if (!isAddTransactionModalOpen) return null;

  const selectedBiz = businesses.find(b => b.id === selectedBizId) || businesses[0];
  const partnerDisplayName = partnerMode === 'custom' && customPartnerName ? customPartnerName : (selectedBiz?.name || 'Commercial Client');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      businessId: partnerMode === 'select' ? (selectedBiz?.id || 'biz_custom') : `cust_${Date.now()}`,
      businessName: partnerDisplayName,
      businessRole: partnerMode === 'select' ? selectedBiz?.industry : 'Commercial Partner',
      customerName: partnerDisplayName,
      type: txType,
      commercialType,
      amount: Number(amount),
      currency,
      status: 'Pending',
      invoiceNumber: invoiceNumber || `TX-${Date.now().toString().substring(6)}`,
      description: description || `${commercialType} with ${partnerDisplayName}`,
      dueDate,
      category,
      paymentMode,
    });

    setPrefilledTxBusiness(null);
    setIsAddTransactionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in-up">
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col glass-card shadow-2xl"
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
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white">Record Commercial Deal / Invoice</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Track invoices, milestones, retainers, and credit balances globally
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setPrefilledTxBusiness(null);
              setIsAddTransactionModalOpen(false);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Balance Flow Toggle */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Commercial Balance Flow</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTxType('Debit')}
                className="p-3 rounded-2xl flex items-center gap-2.5 transition-all text-left"
                style={{
                  background: txType === 'Debit' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                  border: txType === 'Debit' ? '2px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="p-2 rounded-xl"
                  style={{ background: txType === 'Debit' ? '#ef4444' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                >
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white">Receivable / Debit</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>You billed / outstanding</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTxType('Credit')}
                className="p-3 rounded-2xl flex items-center gap-2.5 transition-all text-left"
                style={{
                  background: txType === 'Credit' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                  border: txType === 'Credit' ? '2px solid rgba(16,185,129,0.6)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  className="p-2 rounded-xl"
                  style={{ background: txType === 'Credit' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff' }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-white">Payment / Credit</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Received advance / settled</span>
                </div>
              </button>
            </div>
          </div>

          {/* Commercial Classification */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Contract Nature</label>
              <select
                value={commercialType}
                onChange={e => setCommercialType(e.target.value as TransactionCommercialType)}
                className="w-full p-2.5 rounded-xl font-bold text-white focus:outline-none cursor-pointer"
                style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="Invoice" style={{ background: '#080d1a' }}>Milestone / Invoice</option>
                <option value="Retainer" style={{ background: '#080d1a' }}>Monthly Retainer</option>
                <option value="Procurement" style={{ background: '#080d1a' }}>Purchase Order / Procurement</option>
                <option value="Credit / Udhaar" style={{ background: '#080d1a' }}>Credit Line</option>
                <option value="Debit / Jama" style={{ background: '#080d1a' }}>Debit Line</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Payment Method</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value)}
                className="w-full p-2.5 rounded-xl font-bold text-white focus:outline-none cursor-pointer"
                style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value="Wire / SWIFT" style={{ background: '#080d1a' }}>Wire / SWIFT</option>
                <option value="Bank Transfer" style={{ background: '#080d1a' }}>Bank Transfer / ACH</option>
                <option value="Stripe / Card" style={{ background: '#080d1a' }}>Stripe / Card</option>
                <option value="UPI" style={{ background: '#080d1a' }}>UPI</option>
                <option value="Cash" style={{ background: '#080d1a' }}>Cash</option>
                <option value="Credit / Udhaar" style={{ background: '#080d1a' }}>Credit Terms</option>
              </select>
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-300 font-bold mb-1">Amount *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 rounded-xl font-mono text-base font-black text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full p-2.5 rounded-xl font-bold text-white focus:outline-none cursor-pointer"
                style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {GLOBAL_CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code} style={{ background: '#080d1a' }}>
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Partner Enterprise */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Counterparty Enterprise / Client *</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPartnerMode('select')}
                className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  partnerMode === 'select'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={{ background: partnerMode === 'select' ? '#6366f1' : 'rgba(255,255,255,0.04)' }}
              >
                Select from Network
              </button>
              <button
                type="button"
                onClick={() => setPartnerMode('custom')}
                className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  partnerMode === 'custom'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                style={{ background: partnerMode === 'custom' ? '#6366f1' : 'rgba(255,255,255,0.04)' }}
              >
                Custom Name
              </button>
            </div>

            {partnerMode === 'select' ? (
              <select
                value={selectedBizId}
                onChange={e => setSelectedBizId(e.target.value)}
                className="w-full p-2.5 rounded-xl font-semibold text-white focus:outline-none cursor-pointer"
                style={{ background: '#080d1a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {businesses
                  .filter(b => b.id !== myBusiness.id)
                  .map(b => (
                    <option key={b.id} value={b.id} style={{ background: '#080d1a' }}>
                      {b.name} ({b.industry} — {b.location.city}, {b.location.country})
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={customPartnerName}
                onChange={e => setCustomPartnerName(e.target.value)}
                placeholder="Enter client / partner company name"
                className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            )}
          </div>

          {/* Invoice ID & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Invoice / Ref Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl font-mono text-white placeholder-slate-500 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Settlement / Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl text-white focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">Description / Engagement Milestone</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Q3 Dedicated Creative Squad Retainer & Deliverables"
              className="w-full p-2.5 rounded-xl text-white placeholder-slate-500 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div
            className="flex justify-end gap-2 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              type="button"
              onClick={() => {
                setPrefilledTxBusiness(null);
                setIsAddTransactionModalOpen(false);
              }}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs px-5 py-2">
              Record Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
