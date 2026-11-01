'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Search,
  Download,
  ShieldCheck,
  Send,
  Phone,
  Share2,
  Check,
  Globe,
  Coins,
} from 'lucide-react';
import { formatCurrencyAmount } from '@/data/taxonomy';

export function LedgerView() {
  const {
    transactions,
    settleTransaction,
    setIsAddTransactionModalOpen,
    myBusiness,
    showToast,
  } = useBizLink();

  const [filterType, setFilterType] = useState<'All' | 'Credit' | 'Debit'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Settled'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const totalReceivables = transactions
    .filter(t => t.type === 'Debit' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayables = transactions
    .filter(t => t.type === 'Credit' && t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSettled = transactions
    .filter(t => t.status === 'Settled')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalReceivables - totalPayables;

  const filtered = transactions.filter(t => {
    if (filterType !== 'All' && t.type !== filterType) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.businessName?.toLowerCase().includes(q) ||
        t.customerName?.toLowerCase().includes(q) ||
        t.invoiceNumber?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sendPaymentReminder = (tx: typeof transactions[0]) => {
    const curr = tx.currency || myBusiness.currency;
    const text = `Greetings from ${myBusiness.name}. This is a gentle reminder regarding invoice ${tx.invoiceNumber} for ${formatCurrencyAmount(tx.amount, curr)} (${tx.description}) due on ${tx.dueDate}. Verified on BizLink Universal Network.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Reminder Generated', 'Payment notification generated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Receipt className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Commercial Deals & Global Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Multi-currency commercial ledger tracking invoices, milestones, retainers, and credit/debit balances worldwide.
          </p>
        </div>

        <button
          onClick={() => setIsAddTransactionModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-black shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Record Deal / Invoice
        </button>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Receivables */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Receivables (Pending)
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatCurrencyAmount(totalReceivables, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Invoiced amounts awaiting client payment</p>
          </div>
        </div>

        {/* Received / Payables */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Payments Received / Credit
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatCurrencyAmount(totalPayables, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Settled / advance payments on record</p>
          </div>
        </div>

        {/* Total Settled */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Historical Settled Volume
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatCurrencyAmount(totalSettled, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              ✓ Verified transaction records
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Type */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            <option value="All">All Types</option>
            <option value="Debit">Receivables (Debit)</option>
            <option value="Credit">Received (Credit)</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Settled">Settled</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by client, invoice, description..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transactions Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map(tx => {
            const curr = tx.currency || myBusiness.currency;
            const isDebit = tx.type === 'Debit';

            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 ${
                      isDebit ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isDebit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {tx.invoiceNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-400 capitalize">
                        {tx.commercialType || 'Invoice'} • {tx.paymentMode || 'Wire'}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          tx.status === 'Settled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1 truncate">
                      {tx.customerName || tx.businessName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{tx.description}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">Due Date: {tx.dueDate}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-right">
                    <span
                      className={`text-base font-black font-mono ${
                        isDebit ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {isDebit ? '+' : '-'} {formatCurrencyAmount(tx.amount, curr)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {isDebit ? 'Receivable' : 'Received / Paid'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tx.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => settleTransaction(tx.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                        >
                          Mark Settled
                        </button>
                        <button
                          onClick={() => sendPaymentReminder(tx)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
                          title="Generate payment notice"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No commercial transactions found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Record invoices, milestones, or credit entries to track deal flow.</p>
          </div>
        )}
      </div>
    </div>
  );
}
