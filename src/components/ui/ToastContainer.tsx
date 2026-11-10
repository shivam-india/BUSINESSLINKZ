'use client';

import React from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toastMessage } = useBizLink();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success' || !toastMessage.type;
  const isWarning = toastMessage.type === 'warning';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-fade-in-up pointer-events-auto">
      <div
        className="p-4 rounded-2xl flex items-start gap-3"
        style={{
          background: 'rgba(13,21,38,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(99,102,241,0.2)',
        }}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isWarning && <AlertCircle className="w-5 h-5 text-amber-400" />}
          {isInfo && <Info className="w-5 h-5 text-cyan-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white">{toastMessage.title}</p>
          <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {toastMessage.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
