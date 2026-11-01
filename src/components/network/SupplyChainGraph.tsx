'use client';

import React, { useState, useMemo } from 'react';
import { useBizLink } from '@/context/BizLinkContext';
import { Business, SupplyRelationship, UniversalRelationshipType } from '@/types';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  ShieldCheck,
  Star,
  ExternalLink,
  PlusCircle,
  Globe,
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Handshake,
  FileText,
  Building2,
  X,
} from 'lucide-react';
import { UNIVERSAL_RELATIONSHIP_TYPES, GLOBAL_COUNTRIES } from '@/data/taxonomy';

interface NodeCoordinate {
  id: string;
  business: Business;
  x: number;
  y: number;
  angle: number;
  radius: number;
  sectorColor: string;
  isMyBusiness: boolean;
}

const SECTOR_COLORS: Record<string, { bg: string; border: string; text: string; stroke: string }> = {
  'Technology, AI & Software': { bg: 'bg-blue-900/60', border: 'border-blue-500', text: 'text-blue-300', stroke: '#3b82f6' },
  'Healthcare, Biotech & Medical': { bg: 'bg-teal-900/60', border: 'border-teal-500', text: 'text-teal-300', stroke: '#14b8a6' },
  'Media, Marketing & Creative Design': { bg: 'bg-fuchsia-900/60', border: 'border-fuchsia-500', text: 'text-fuchsia-300', stroke: '#d946ef' },
  'Manufacturing & Industrial Production': { bg: 'bg-amber-900/60', border: 'border-amber-500', text: 'text-amber-300', stroke: '#f59e0b' },
  'Logistics, Supply Chain & Transport': { bg: 'bg-sky-900/60', border: 'border-sky-500', text: 'text-sky-300', stroke: '#0284c7' },
  'Construction, Architecture & Real Estate': { bg: 'bg-orange-900/60', border: 'border-orange-500', text: 'text-orange-300', stroke: '#ea580c' },
  'Finance, Legal & Professional Advisory': { bg: 'bg-indigo-900/60', border: 'border-indigo-500', text: 'text-indigo-300', stroke: '#6366f1' },
  'Agriculture, Farming & Environmental': { bg: 'bg-emerald-900/60', border: 'border-emerald-500', text: 'text-emerald-300', stroke: '#10b981' },
  'Hospitality, Food Science & Tourism': { bg: 'bg-yellow-900/60', border: 'border-yellow-500', text: 'text-yellow-300', stroke: '#eab308' },
  'Local Services & Skilled Specialists': { bg: 'bg-rose-900/60', border: 'border-rose-500', text: 'text-rose-300', stroke: '#f43f5e' },
};

export function SupplyChainGraph() {
  const {
    myBusiness,
    businesses,
    relationships,
    connectBusinesses,
    setInspectingBusiness,
    setDashboardView,
  } = useBizLink();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('all');
  const [selectedRelFilter, setSelectedRelFilter] = useState<string>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Business | null>(myBusiness);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [targetBizToConnect, setTargetBizToConnect] = useState<string>(businesses[1]?.id || '');
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<UniversalRelationshipType>('Strategic Partner ↔ Partner');
  const [connectionCategory, setConnectionCategory] = useState('Cross-Border Technology & Service Synergy');

  // Compute layout coordinates for nodes in a multi-radial orbital structure
  const { nodes, links } = useMemo(() => {
    const businessMap = new Map<string, Business>(businesses.map(b => [b.id, b]));

    // Connected nodes
    const activeNodeIds = new Set<string>();
    activeNodeIds.add(myBusiness.id);
    relationships.forEach(r => {
      activeNodeIds.add(r.sourceId);
      activeNodeIds.add(r.targetId);
    });

    // Also include any directory businesses
    businesses.forEach(b => activeNodeIds.add(b.id));

    const otherBizList = Array.from(activeNodeIds)
      .map(id => businessMap.get(id))
      .filter((b): b is Business => Boolean(b && b.id !== myBusiness.id));

    const centerX = 500;
    const centerY = 450;
    const graphNodes: NodeCoordinate[] = [];

    // Center node (My Enterprise)
    graphNodes.push({
      id: myBusiness.id,
      business: myBusiness,
      x: centerX,
      y: centerY,
      angle: 0,
      radius: 0,
      sectorColor: '#3b82f6',
      isMyBusiness: true,
    });

    // Arrange other nodes in two orbital rings
    const ring1Radius = 260;
    const ring2Radius = 380;
    const total = otherBizList.length;

    otherBizList.forEach((b, idx) => {
      const isInnerRing = idx % 2 === 0;
      const radius = isInnerRing ? ring1Radius : ring2Radius;
      const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const sector = SECTOR_COLORS[b.industry] || { stroke: '#94a3b8' };

      graphNodes.push({
        id: b.id,
        business: b,
        x,
        y,
        angle,
        radius,
        sectorColor: sector.stroke,
        isMyBusiness: false,
      });
    });

    // Map links
    const nodeCoordMap = new Map(graphNodes.map(n => [n.id, n]));
    const graphLinks = relationships
      .map(r => {
        const sourceNode = nodeCoordMap.get(r.sourceId);
        const targetNode = nodeCoordMap.get(r.targetId);
        if (!sourceNode || !targetNode) return null;
        return {
          id: r.id,
          source: sourceNode,
          target: targetNode,
          relationship: r,
        };
      })
      .filter(Boolean);

    return { nodes: graphNodes, links: graphLinks };
  }, [businesses, relationships, myBusiness]);

  // Node filter check
  const filteredNodes = nodes.filter(n => {
    if (n.isMyBusiness) return true;
    if (selectedIndustryFilter !== 'all' && n.business.industry !== selectedIndustryFilter) {
      return false;
    }
    return true;
  });

  const nodeMap = new Map(filteredNodes.map(n => [n.id, n]));

  // Link filter check
  const filteredLinks = links.filter(l => {
    if (!l) return false;
    if (!nodeMap.has(l.source.id) || !nodeMap.has(l.target.id)) return false;
    if (selectedRelFilter !== 'all' && l.relationship.relationshipType !== selectedRelFilter) {
      return false;
    }
    return true;
  });

  // Selected Business Relationship details
  const activeRelationshipWithSelected = useMemo(() => {
    if (!selectedNode || selectedNode.id === myBusiness.id) return null;
    return relationships.find(
      r =>
        (r.sourceId === myBusiness.id && r.targetId === selectedNode.id) ||
        (r.sourceId === selectedNode.id && r.targetId === myBusiness.id)
    );
  }, [selectedNode, myBusiness, relationships]);

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = businesses.find(b => b.id === targetBizToConnect);
    if (!target) return;
    connectBusinesses(target, selectedRelationshipType, connectionCategory);
    setIsConnectModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-slate-950 text-slate-100 overflow-hidden relative select-none">
      {/* Top Universal Filter Bar */}
      <div className="bg-slate-900/95 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-md">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Universal Ecosystem Network</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Sector Mesh
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive relationship visualizer connecting tech, healthcare, manufacturing, creative, logistics, and consulting worldwide.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Industry Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedIndustryFilter}
              onChange={e => setSelectedIndustryFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Industries ({businesses.length})</option>
              {Object.keys(SECTOR_COLORS).map(ind => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Handshake className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRelFilter}
              onChange={e => setSelectedRelFilter(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="all">All Relationship Types</option>
              {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                <option key={rel.id} value={rel.id}>
                  {rel.label}
                </option>
              ))}
            </select>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 text-slate-400">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Connect Enterprise CTA */}
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Form New Connection
          </button>
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Interactive SVG Network Canvas */}
        <div className="flex-1 h-full overflow-auto flex items-center justify-center p-8 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="w-[1000px] h-[900px] relative shrink-0"
          >
            <svg className="w-full h-full absolute inset-0 pointer-events-none">
              <defs>
                <linearGradient id="primaryLinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Orbital guide rings */}
              <circle cx="500" cy="450" r="260" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
              <circle cx="500" cy="450" r="380" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />

              {/* Dynamic Connection Beziers */}
              {filteredLinks.map((link, idx) => {
                if (!link) return null;
                const isHovered = hoveredNodeId === link.source.id || hoveredNodeId === link.target.id;
                const isSelected = selectedNode?.id === link.source.id || selectedNode?.id === link.target.id;

                // Control point for smooth curved bezier
                const midX = (link.source.x + link.target.x) / 2;
                const midY = (link.source.y + link.target.y) / 2;
                const dx = link.target.x - link.source.x;
                const dy = link.target.y - link.source.y;
                const normalX = -dy * 0.15;
                const normalY = dx * 0.15;
                const cx = midX + normalX;
                const cy = midY + normalY;

                return (
                  <g key={`link_${idx}`} className="transition-all duration-300">
                    <path
                      d={`M ${link.source.x} ${link.source.y} Q ${cx} ${cy} ${link.target.x} ${link.target.y}`}
                      fill="none"
                      stroke={isSelected ? '#38bdf8' : isHovered ? '#60a5fa' : link.source.sectorColor}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                      strokeOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0.4}
                      strokeDasharray={link.relationship.status === 'collaborating' ? '6 4' : 'none'}
                      filter={isSelected ? 'url(#glow)' : undefined}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {filteredNodes.map(node => {
              const isCenter = node.isMyBusiness;
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const country = GLOBAL_COUNTRIES.find(c => c.code === node.business.location.countryCode) || GLOBAL_COUNTRIES[0];
              const sector = SECTOR_COLORS[node.business.industry] || { bg: 'bg-slate-800', border: 'border-slate-600', text: 'text-slate-300', stroke: '#94a3b8' };

              return (
                <div
                  key={node.id}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => setSelectedNode(node.business)}
                  className={`absolute cursor-pointer transition-all duration-300 group ${isCenter ? 'z-30' : isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                    }`}
                >
                  {isCenter ? (
                    // Center Hub Node (Your Business)
                    <div className="relative flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/50 flex items-center justify-center animate-pulse">
                        <div className="w-full h-full bg-slate-950 rounded-2xl flex flex-col items-center justify-center p-2 text-center">
                          <Building2 className="w-6 h-6 text-cyan-400" />
                          <span className="text-[9px] font-black text-white mt-1 leading-tight line-clamp-1">
                            {node.business.name.split(' ')[0]}
                          </span>
                          <span className="text-[8px] font-bold text-cyan-400 uppercase">You (Hub)</span>
                        </div>
                      </div>
                      <div className="mt-2 bg-slate-900/90 border border-cyan-500/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
                        {node.business.name}
                      </div>
                    </div>
                  ) : (
                    // Satellite Enterprise Node
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center p-1 transition-all shadow-lg ${sector.bg} ${isSelected
                          ? 'border-white ring-4 ring-cyan-400/50 shadow-cyan-500/40'
                          : isHovered
                            ? 'border-cyan-400 shadow-cyan-500/20'
                            : sector.border
                          }`}
                      >
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className="text-sm">{country.flag}</span>
                          <span className="text-[9px] font-bold text-white leading-tight line-clamp-1 px-1">
                            {node.business.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Floating pill badge */}
                      <div
                        className={`mt-1.5 px-2 py-0.5 rounded-md text-[9px] font-semibold tracking-tight whitespace-nowrap max-w-[140px] truncate shadow-md ${isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                          }`}
                      >
                        {node.business.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Entity Inspector Sidebar */}
        {selectedNode && (
          <aside className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between shrink-0 h-full p-5 overflow-y-auto z-20 shadow-2xl">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {selectedNode.id === myBusiness.id ? 'Your Enterprise' : 'Ecosystem Partner'}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight mt-0.5">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedNode.tagline || selectedNode.description}</p>
                </div>
                {selectedNode.id !== myBusiness.id && (
                  <button
                    onClick={() => setSelectedNode(myBusiness)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Key Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Industry Domain</span>
                  <p className="font-bold text-white truncate mt-0.5">{selectedNode.industry}</p>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Business Model</span>
                  <p className="font-bold text-cyan-400 truncate mt-0.5">{selectedNode.primaryBusinessModel}</p>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Location</span>
                  <p className="font-bold text-white truncate mt-0.5">
                    {selectedNode.location.city}, {selectedNode.location.country}
                  </p>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 font-medium">Network Trust</span>
                  <p className="font-bold text-emerald-400 mt-0.5">
                    ★ {selectedNode.rating} ({selectedNode.trustScore}/100)
                  </p>
                </div>
              </div>

              {/* Relationship Status Section */}
              {activeRelationshipWithSelected ? (
                <div className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Handshake className="w-4 h-4 text-cyan-400" />
                      {activeRelationshipWithSelected.relationshipType || 'Connected Partner'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{activeRelationshipWithSelected.category}</p>

                  <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-indigo-900/60">
                    <div className="flex justify-between">
                      <span>Volume / Terms:</span>
                      <span className="font-mono text-slate-200">{activeRelationshipWithSelected.volumeMonthly || 'Synergy'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial Mode:</span>
                      <span className="text-indigo-300 font-medium capitalize">
                        {activeRelationshipWithSelected.commercialNature?.replace('_', ' ') || 'Professional Network'}
                      </span>
                    </div>
                  </div>

                  {activeRelationshipWithSelected.sharedProjects && (
                    <div className="pt-2 border-t border-indigo-900/60">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Collaborative Projects:</span>
                      <ul className="mt-1 space-y-1 text-xs text-slate-200">
                        {activeRelationshipWithSelected.sharedProjects.map((p, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : selectedNode.id !== myBusiness.id ? (
                <div className="p-3 bg-slate-800/60 rounded-xl border border-dashed border-slate-700 text-center space-y-2">
                  <p className="text-xs text-slate-400">No active relationship formalized yet with this enterprise.</p>
                  <button
                    onClick={() => {
                      setTargetBizToConnect(selectedNode.id);
                      setIsConnectModalOpen(true);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Connect & Partner
                  </button>
                </div>
              ) : null}

              {/* Offerings Highlights */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Featured Offerings ({selectedNode.offerings?.length || 0})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedNode.offerings && selectedNode.offerings.length > 0 ? (
                    selectedNode.offerings.map(off => (
                      <div
                        key={off.id}
                        className="p-2 bg-slate-800/80 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-200 truncate">{off.name}</p>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {off.type} • {off.pricingModel.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-mono text-cyan-300 font-bold shrink-0">
                          {off.currency} {off.price.toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No catalogue listings published yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setInspectingBusiness(selectedNode)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                View Full Universal Profile
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Connection Builder Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Form Universal Business Relationship</h3>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Enterprise</label>
                <select
                  value={targetBizToConnect}
                  onChange={e => setTargetBizToConnect(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {businesses
                    .filter(b => b.id !== myBusiness.id)
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.industry} — {b.location.city}, {b.location.country})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship Type</label>
                <select
                  value={selectedRelationshipType}
                  onChange={e => setSelectedRelationshipType(e.target.value as UniversalRelationshipType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {UNIVERSAL_RELATIONSHIP_TYPES.map(rel => (
                    <option key={rel.id} value={rel.id}>
                      {rel.label} — {rel.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Engagement Description / Scope</label>
                <input
                  type="text"
                  value={connectionCategory}
                  onChange={e => setConnectionCategory(e.target.value)}
                  placeholder="e.g. Cross-border Cloud Infrastructure & Strategic Marketing Retainer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">Universal Network Principle:</p>
                <p className="mt-0.5">
                  Connecting establishes a professional link on the graph. Commercial contracts, milestones, and transactions remain independent and can be formalized in the Deals Ledger.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Establish Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
