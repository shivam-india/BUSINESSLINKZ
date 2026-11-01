'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Star, ShieldCheck, CheckCircle2, Award, ThumbsUp, MessageSquare } from 'lucide-react';

export function ReviewsView() {
  const { myBusiness } = useBizLink();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Verified Reputation & Trust Credentials
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Transparent enterprise trust score combining global regulatory compliance, client testimonials, and fulfillment track record.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-xs font-bold text-amber-800">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>{myBusiness.rating.toFixed(1)} Aggregate Score</span>
          <span className="text-slate-400 font-normal">({myBusiness.reviewCount} verified reviews)</span>
        </div>
      </div>

      {/* Trust Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identity & Legal Verification</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">100% Verified</div>
          <p className="text-[11px] text-slate-500 font-medium truncate">
            Entity ID: {myBusiness.taxIdentifier || myBusiness.gstNumber || 'Audited Enterprise'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contract Delivery SLA</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{myBusiness.fulfillmentRate}%</div>
          <p className="text-[11px] text-slate-500 font-medium">On-time milestone delivery rate</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Network Trust Index</span>
            <ThumbsUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600">{myBusiness.trustScore} / 100</div>
          <p className="text-[11px] text-slate-500 font-medium">Impeccable trade & commercial record</p>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900">Verified Client & Partner Testimonials</h4>

        <div className="space-y-3">
          {myBusiness.reviews.map(rev => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{rev.authorName}</h5>
                  {rev.authorBusiness && (
                    <p className="text-[11px] text-indigo-600 font-medium">
                      {rev.authorRole || 'Executive'} at {rev.authorBusiness}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
              <span className="text-[10px] text-slate-400 block">{rev.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
