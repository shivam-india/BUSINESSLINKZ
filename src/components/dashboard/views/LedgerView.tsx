'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Search,
  Send,
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
    <div className="space-y-6 max-w-7xl mx-auto p-2 pb-16">
      {/* Header & Controls */}
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
              style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              Commercial Ledger
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Multi-Currency Deal Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Commercial Deals & Global Ledger
          </h1>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Track invoices, milestones, retainers, and credit/debit balances worldwide with persistent cloud synchronization.
          </p>
        </div>

        <button
          onClick={() => setIsAddTransactionModalOpen(true)}
          className="btn-accent text-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record Deal / Invoice
        </button>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Receivables */}
        <div className="glass-card stat-card rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Receivables (Pending)
            </span>
            <div
              className="p-2 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
            >
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white font-mono">
              {formatCurrencyAmount(totalReceivables, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Invoiced amounts awaiting settlement</p>
          </div>
        </div>

        {/* Payments Received / Credit */}
        <div className="glass-card stat-card rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Payments Received / Credit
            </span>
            <div
              className="p-2 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white font-mono">
              {formatCurrencyAmount(totalPayables, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Settled / advance payments on record</p>
          </div>
        </div>

        {/* Total Settled Volume */}
        <div className="glass-card stat-card rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Historical Settled Volume
            </span>
            <div
              className="p-2 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-white font-mono">
              {formatCurrencyAmount(totalSettled, myBusiness.currency)}
            </div>
            <p className="text-[11px] text-emerald-400 font-bold mt-1">
              ✓ Verified transaction records
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Type */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="p-2 rounded-xl font-bold text-white focus:outline-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <option value="All" style={{ background: '#0d1526' }}>All Flow Types</option>
            <option value="Debit" style={{ background: '#0d1526' }}>Receivables (Debit)</option>
            <option value="Credit" style={{ background: '#0d1526' }}>Received (Credit)</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="p-2 rounded-xl font-bold text-white focus:outline-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <option value="All" style={{ background: '#0d1526' }}>All Statuses</option>
            <option value="Pending" style={{ background: '#0d1526' }}>Pending</option>
            <option value="Settled" style={{ background: '#0d1526' }}>Settled</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by client, invoice, description..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {filtered.map(tx => {
            const curr = tx.currency || myBusiness.currency;
            const isDebit = tx.type === 'Debit';

            return (
              <div
                key={tx.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className="p-2.5 rounded-2xl shrink-0"
                    style={{
                      background: isDebit ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                      color: isDebit ? '#ef4444' : '#10b981',
                    }}
                  >
                    {isDebit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}
                      >
                        {tx.invoiceNumber}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">
                        {tx.commercialType || 'Invoice'} • {tx.paymentMode || 'Wire'}
                      </span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                        style={
                          tx.status === 'Settled'
                            ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                            : { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
                        }
                      >
                        {tx.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 truncate">
                      {tx.customerName || tx.businessName}
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {tx.description}
                    </p>
                    <span className="text-[10px] text-slate-500 block mt-1">Due Date: {tx.dueDate}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="text-right">
                    <span
                      className={`text-base font-black font-mono ${
                        isDebit ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isDebit ? '+' : '-'} {formatCurrencyAmount(tx.amount, curr)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isDebit ? 'Receivable' : 'Settled / Credit'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tx.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => settleTransaction(tx.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                          style={{ background: '#10b981', color: '#04070f' }}
                        >
                          Mark Settled
                        </button>
                        <button
                          onClick={() => sendPaymentReminder(tx)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
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
          <div className="p-16 text-center">
            <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30 text-cyan-400" />
            <p className="text-xs font-bold text-white">No commercial transactions found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Record invoices, milestones, or credit entries to track deal flow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
