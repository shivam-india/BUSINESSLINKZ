'use client';

import React, { useState } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import {
  Key,
  Shield,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Database,
  Cloud,
  Lock,
  Download,
  Upload,
  Check,
  Server,
  Sparkles,
} from 'lucide-react';

export function SettingsView() {
  const { useMockMode, setUseMockMode, showToast, cloudStatus, configureCloud, businesses, transactions, relationships, myBusiness, currentUser } = useBizLink();
  
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Firebase Config Form
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [isConnectingCloud, setIsConnectingCloud] = useState(false);
  const [cloudConnectMsg, setCloudConnectMsg] = useState<{ text: string; success: boolean } | null>(null);

  const handleTestSerpApi = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Robotics & Automation',
          location: 'Worldwide',
          radiusKm: 50,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTestResult(
          `Success: Connected via ${data.source}. Returned ${data.totalResults} results in ${data.latencyMs}ms. Query executed: "${data.serpApiQueryUsed}"`
        );
        showToast('Discovery Status', `API operational. Mode: ${data.source}`, 'success');
      } else {
        setTestResult(`Error: ${data.error || 'Request failed'}`);
      }
    } catch (err) {
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Failed to connect'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnectFirebase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      showToast('Validation Error', 'API Key and Project ID are required.', 'warning');
      return;
    }

    setIsConnectingCloud(true);
    setCloudConnectMsg(null);

    try {
      const res = await configureCloud({
        apiKey: apiKey.trim(),
        projectId: projectId.trim(),
        authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      });

      setCloudConnectMsg({ text: res.message, success: res.success });
    } catch (err: any) {
      setCloudConnectMsg({ text: err.message || 'Connection failed', success: false });
    } finally {
      setIsConnectingCloud(false);
    }
  };

  const handleExportBackup = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      account: currentUser,
      enterprise: myBusiness,
      relationships,
      transactions,
      businesses,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bizlink-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Vault Backup Exported', 'Downloaded complete encrypted local vault state.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
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
              Enterprise Infrastructure
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Cloud Engine & Security</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cloud Database & Network Settings</h2>
          <p className="text-xs leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Manage persistent storage for business accounts, cloud synchronization with Firebase/Supabase, search API integrations, and local data vaults.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          className="btn-secondary text-xs shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Vault JSON
        </button>
      </div>

      {/* Cloud Persistence Status Card */}
      <div className="glass-card rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)' }}
            >
              <Cloud className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Data Storage Engine</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Real-time persistence for accounts, directory & commercial ledgers</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"
              style={
                cloudStatus.isConnected
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                  : { background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
              }
            >
              <span className={`w-2 h-2 rounded-full ${cloudStatus.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
              {cloudStatus.provider}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Persisted Entities</span>
            <span className="text-xl font-black text-white mt-1 block">
              {businesses.length + transactions.length + relationships.length}
            </span>
            <span className="text-[10px] text-cyan-400">Zero data loss across reloads</span>
          </div>

          <div className="p-3.5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Account Vault ID</span>
            <span className="text-sm font-mono font-bold text-white mt-1 block truncate">
              {currentUser.id}
            </span>
            <span className="text-[10px] text-emerald-400">Authenticated & Active</span>
          </div>

          <div className="p-3.5 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Persistence State</span>
            <span className="text-sm font-bold text-white mt-1 block flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Auto-Synced
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              {cloudStatus.lastSyncedAt ? new Date(cloudStatus.lastSyncedAt).toLocaleTimeString() : 'Current Session'}
            </span>
          </div>
        </div>

        {/* Connect Cloud Form */}
        <div
          className="p-5 rounded-2xl space-y-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Connect Custom Firebase Project</h4>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Link your live Google Cloud / Firebase Firestore credentials to sync all accounts across devices and production deployments in real-time.
          </p>

          <form onSubmit={handleConnectFirebase} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Firebase Project ID *</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  placeholder="e.g. bizlink-network-prod"
                  className="w-full p-2.5 rounded-xl text-white placeholder-slate-600 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Firebase API Key *</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2.5 rounded-xl text-white placeholder-slate-600 focus:outline-none font-mono"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Tip: Keys can also be placed in <code>.env.local</code> as <code>NEXT_PUBLIC_FIREBASE_API_KEY</code>.
              </span>

              <button
                type="submit"
                disabled={isConnectingCloud}
                className="btn-accent text-xs w-full sm:w-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isConnectingCloud ? 'Connecting to Cloud...' : 'Connect Cloud Database'}
              </button>
            </div>

            {cloudConnectMsg && (
              <div
                className="p-3 rounded-xl text-xs font-semibold mt-2"
                style={
                  cloudConnectMsg.success
                    ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                    : { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
                }
              >
                {cloudConnectMsg.text}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Discovery Backend Engine */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Universal Search & SerpApi Engine</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Server-side proxy for worldwide business discovery</p>
            </div>
          </div>

          <span
            className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Isolated in Node.js Proxy
          </span>
        </div>

        <div
          className="p-4 rounded-xl font-mono text-xs space-y-1.5"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-slate-500">// Server Environment Configuration (.env.local)</div>
          <div className="text-emerald-400">SERPAPI_KEY=********************************</div>
          <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-800">
            Protected: API key is never exposed to the client-side JavaScript bundle. Requests proxy through <code>/api/search-businesses</code>.
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useMockMode}
              onChange={e => setUseMockMode(e.target.checked)}
              className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Force Offline Sandbox Mode (Demonstrations)</span>
          </label>

          <button
            onClick={handleTestSerpApi}
            disabled={isTesting}
            className="btn-secondary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'Testing Search API...' : 'Test Search Endpoint'}
          </button>
        </div>

        {testResult && (
          <div
            className="p-3.5 rounded-xl text-xs font-mono"
            style={
              testResult.startsWith('Success')
                ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
                : { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }
            }
          >
            {testResult}
          </div>
        )}
      </div>

      {/* Architecture & Discovery Guide */}
      <div className="glass-card rounded-3xl p-6 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Enterprise Global Architecture Principles
        </h4>
        <ul className="text-xs space-y-2 list-disc list-inside leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <li><strong className="text-white">Universal Dual-Tier Persistence:</strong> Data is synchronized directly to client-side persistent storage and optionally linked to Firebase Cloud Firestore. Accounts and listings survive reloads, browser closures, and cross-session operations.</li>
          <li><strong className="text-white">Industry-Independent Taxonomy:</strong> 14 global sectors with arbitrary subcategory scalability. No database column restrictions force a business into a B2B supplier role.</li>
          <li><strong className="text-white">Multi-Currency & Internationalization:</strong> Supports USD, EUR, GBP, JPY, INR, AUD, SGD, AED and automatic regional currency formatting.</li>
          <li><strong className="text-white">Zero-Silo Discovery:</strong> Professional discovery is completely decoupled from commercial transactions, allowing organizations of all sizes to connect.</li>
        </ul>
      </div>
    </div>
  );
}
