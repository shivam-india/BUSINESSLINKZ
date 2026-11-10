'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Star, ShieldCheck, Award, ThumbsUp } from 'lucide-react';

export function ReviewsView() {
  const { myBusiness } = useBizLink();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 pb-16">
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
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}
            >
              Enterprise Reputation
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Trust Verification Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verified Reputation & Trust Credentials
          </h1>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Transparent enterprise trust score combining global regulatory compliance, client testimonials, and fulfillment track record.
          </p>
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold"
          style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.3)',
            color: '#fbbf24',
          }}
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{myBusiness.rating.toFixed(1)} Aggregate Score</span>
          <span className="text-slate-400 font-normal">({myBusiness.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Trust Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card stat-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Identity Verification
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">100% Verified</div>
          <p className="text-[11px] text-slate-400 font-medium truncate">
            ID: {myBusiness.taxIdentifier || myBusiness.gstNumber || 'Audited Enterprise'}
          </p>
        </div>

        <div className="glass-card stat-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Contract Delivery SLA
            </span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{myBusiness.fulfillmentRate}%</div>
          <p className="text-[11px] text-slate-400 font-medium">On-time milestone delivery rate</p>
        </div>

        <div className="glass-card stat-card rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Network Trust Index
            </span>
            <ThumbsUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{myBusiness.trustScore} / 100</div>
          <p className="text-[11px] text-slate-400 font-medium">Impeccable trade & commercial record</p>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-white">Verified Client & Partner Testimonials</h4>

        <div className="space-y-3">
          {myBusiness.reviews.map(rev => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl space-y-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{rev.authorName}</h5>
                  {rev.authorBusiness && (
                    <p className="text-[11px] text-indigo-400 font-medium">
                      {rev.authorRole || 'Executive'} at {rev.authorBusiness}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              <span className="text-[10px] text-slate-500 block">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
