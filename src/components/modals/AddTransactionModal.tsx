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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">Record Commercial Deal / Invoice</h3>
              <p className="text-xs text-indigo-200">Track invoices, milestones, retainers, and credit balances globally</p>
            </div>
          </div>
          <button
            onClick={() => {
              setPrefilledTxBusiness(null);
              setIsAddTransactionModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Type Toggle: Debit (You Gave / Receivable) vs Credit (You Got / Received) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Commercial Balance Flow</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTxType('Debit')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                  txType === 'Debit'
                    ? 'border-rose-500 bg-rose-50/60 text-rose-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${txType === 'Debit' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">Receivable / Debit</span>
                  <span className="text-[10px] text-slate-500">You billed / outstanding</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTxType('Credit')}
                className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-left ${
                  txType === 'Credit'
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-xl ${txType === 'Credit' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">Payment / Credit</span>
                  <span className="text-[10px] text-slate-500">Received advance / paid</span>
                </div>
              </button>
            </div>
          </div>

          {/* Commercial Classification */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Contract Nature</label>
              <select
                value={commercialType}
                onChange={e => setCommercialType(e.target.value as TransactionCommercialType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Invoice">Milestone / Invoice</option>
                <option value="Retainer">Monthly Retainer</option>
                <option value="Procurement">Purchase Order / Procurement</option>
                <option value="Credit / Udhaar">Credit / Udhaar</option>
                <option value="Debit / Jama">Debit / Jama</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
              <select
                value={paymentMode}
                onChange={e => setPaymentMode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Wire / SWIFT">Wire / SWIFT</option>
                <option value="Bank Transfer">Bank Transfer / ACH</option>
                <option value="Stripe / Card">Stripe / Credit Card</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit / Udhaar">Credit Terms</option>
              </select>
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Amount *</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {GLOBAL_CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Partner Enterprise */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Counterparty Enterprise / Client *</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPartnerMode('select')}
                className={`flex-1 py-1 rounded-lg font-bold text-[11px] ${
                  partnerMode === 'select' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Select from Network
              </button>
              <button
                type="button"
                onClick={() => setPartnerMode('custom')}
                className={`flex-1 py-1 rounded-lg font-bold text-[11px] ${
                  partnerMode === 'custom' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Custom Name
              </button>
            </div>

            {partnerMode === 'select' ? (
              <select
                value={selectedBizId}
                onChange={e => setSelectedBizId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {businesses
                  .filter(b => b.id !== myBusiness.id)
                  .map(b => (
                    <option key={b.id} value={b.id}>
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
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>

          {/* Invoice ID & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Invoice / Ref Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={e => setInvoiceNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Settlement / Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Description / Engagement Milestone</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Q3 Dedicated Creative Squad Retainer & Deliverables"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setPrefilledTxBusiness(null);
                setIsAddTransactionModalOpen(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
            >
              Record Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
