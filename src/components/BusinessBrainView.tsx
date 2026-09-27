import React, { useState } from 'react';
import {
  Brain,
  ShieldCheck,
  Globe,
  Plus,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Search,
  Filter,
  Check,
} from 'lucide-react';
import { AppState, appStore, KNOWLEDGE_PRECEDENCE } from '../services/store';
import { KnowledgeItem, KnowledgeSourceType } from '../types';
import { AiService } from '../services/aiService';

interface BusinessBrainViewProps {
  state: AppState;
}

export const BusinessBrainView: React.FC<BusinessBrainViewProps> = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImporter, setShowImporter] = useState(false);

  // Web Importer state
  const [importUrl, setImportUrl] = useState(state.profile.website || 'https://www.divegohurghada.com/');
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  // Add Item form state
  const [newItem, setNewItem] = useState({
    subject: '',
    category: 'pricing' as KnowledgeItem['category'],
    content: '',
    sourceType: 'OWNER_VERIFIED' as KnowledgeSourceType,
    sourceName: 'Owner Direct Confirmation',
    confidence: 1.0,
    expiresAt: '',
  });

  const filteredKnowledge = state.knowledgeBase.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.subject || !newItem.content) return;

    appStore.addKnowledgeItem({
      category: newItem.category,
      subject: newItem.subject,
      content: newItem.content,
      sourceType: newItem.sourceType,
      sourceName: newItem.sourceName,
      confidence: newItem.confidence,
      verifiedByOwner: newItem.sourceType === 'OWNER_VERIFIED',
      expiresAt: newItem.expiresAt ? new Date(newItem.expiresAt).toISOString() : null,
      status: 'active',
    });

    setShowAddModal(false);
    setNewItem({
      subject: '',
      category: 'pricing',
      content: '',
      sourceType: 'OWNER_VERIFIED',
      sourceName: 'Owner Direct Confirmation',
      confidence: 1.0,
      expiresAt: '',
    });
  };

  const handleRunWebImport = async () => {
    setIsImporting(true);
    setImportResult(null);
    try {
      const data = await AiService.analyzeWebsite(importUrl, importText);
      setImportResult(data);
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleApplyImportedData = () => {
    if (!importResult?.result) return;
    const res = importResult.result;

    if (res.companyName) {
      appStore.updateProfile({
        companyName: res.companyName,
        website: res.website || importUrl,
        phone: res.phone || state.profile.phone,
        email: res.email || state.profile.email,
        location: res.location || state.profile.location,
      });
    }

    if (res.extractedServices && Array.isArray(res.extractedServices)) {
      for (const s of res.extractedServices) {
        appStore.addService({
          title: s.title,
          category: s.category || 'sea_trip',
          description: `Imported excursion from ${importUrl}`,
          priceAdult: s.priceAdult || 50,
          priceChild: s.priceChild || 25,
          currency: 'EUR (€)',
          durationHours: s.durationHours || 7,
          departureTimes: ['08:00 AM'],
          meetingPoint: s.meetingPoint || 'Hotel Lobby',
          pickupAreasIncluded: ['Hurghada'],
          inclusions: s.inclusions || ['Hotel transfer', 'Equipment', 'Lunch'],
          exclusions: [],
          minParticipants: 1,
          maxCapacity: 30,
          cancellationPolicy: '24h free cancellation',
          childPolicy: 'Children under 4 free',
          languagesOffered: ['English', 'German', 'Arabic'],
          verificationSource: 'OFFICIAL_WEBSITE',
          isAvailable: true,
        });
      }
    }

    if (res.extractedPolicies && Array.isArray(res.extractedPolicies)) {
      for (const p of res.extractedPolicies) {
        appStore.addKnowledgeItem({
          category: 'policy',
          subject: p.subject || 'Imported Policy',
          content: p.content,
          sourceType: 'OFFICIAL_WEBSITE',
          sourceName: `Website Parser: ${importUrl}`,
          confidence: 0.85,
          verifiedByOwner: false,
          expiresAt: null,
          status: 'pending_review',
        });
      }
    }

    setShowImporter(false);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Brain className="h-4 w-4" />
            <span>Operational Business Brain (§7 & §8)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Multi-Source Knowledge & Provenance Engine</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Customer conversation must <strong>NEVER</strong> automatically become authoritative business truth. Every
            fact is tagged with provenance, confidence, owner approval status, and strict precedence hierarchy.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Globe className="h-4 w-4 text-cyan-400" />
            <span>Website Importer</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Verified Fact</span>
          </button>
        </div>
      </div>

      {/* Precedence Hierarchy Legend (§8) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs">
        <span className="font-bold text-slate-300 block mb-2">Authority Precedence Hierarchy (Section 8):</span>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {[
            { name: '1. OWNER VERIFIED', weight: 100, color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
            { name: '2. MASTER DB', weight: 90, color: 'bg-blue-950 text-blue-300 border-blue-700' },
            { name: '3. CURRENT TOUR SOURCE', weight: 80, color: 'bg-cyan-950 text-cyan-300 border-cyan-700' },
            { name: '4. OFFICIAL WEBSITE', weight: 70, color: 'bg-indigo-950 text-indigo-300 border-indigo-700' },
            { name: '5. AUTHORIZED PLATFORM', weight: 60, color: 'bg-amber-950 text-amber-300 border-amber-700' },
            { name: '6. DOCUMENTS', weight: 50, color: 'bg-slate-800 text-slate-300 border-slate-700' },
            { name: '7. RESERVATION DATA', weight: 40, color: 'bg-slate-800 text-slate-400 border-slate-700' },
            { name: '8. CUSTOMER STATEMENT (Non-Auth)', weight: 20, color: 'bg-red-950/60 text-red-300 border-red-800' },
            { name: '9. AI INFERENCE', weight: 10, color: 'bg-purple-950 text-purple-300 border-purple-800' },
          ].map((h, i) => (
            <span key={i} className={`px-2.5 py-1 rounded-lg border font-medium ${h.color}`}>
              {h.name} ({h.weight})
            </span>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search verified knowledge, cancellation policies, prices, pickup notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="all">All Categories</option>
          <option value="pricing">Pricing & Payments</option>
          <option value="policy">Operational Policies</option>
          <option value="location_pickup">Pickup & Locations</option>
          <option value="service_detail">Service Specifications</option>
          <option value="faq">FAQs</option>
        </select>
      </div>

      {/* Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredKnowledge.map((item) => {
          const isStale =
            item.status === 'stale' || (item.expiresAt && new Date(item.expiresAt) < new Date());

          return (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-3 transition ${
                isStale
                  ? 'border-amber-700/60 bg-amber-950/10'
                  : item.verifiedByOwner
                  ? 'border-slate-800 hover:border-cyan-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                    {item.category.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white">{item.subject}</h3>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.sourceType === 'OWNER_VERIFIED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : item.sourceType === 'AUTHORIZED_PLATFORM'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-blue-950 text-blue-300 border-blue-800'
                    }`}
                  >
                    {item.sourceType.replace('_', ' ')}
                  </span>

                  {isStale && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>STALE / EXPIRED</span>
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                {item.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
                <span>Source: {item.sourceName}</span>
                <div className="flex items-center space-x-2">
                  <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  {item.verifiedByOwner && (
                    <span className="text-emerald-400 flex items-center space-x-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Website Importer Modal (§10) */}
      {showImporter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-base">
                <Globe className="h-5 w-5" />
                <span className="text-white">Website Knowledge Importer (§10)</span>
              </div>
              <button onClick={() => setShowImporter(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Extract structured tour listings, pricing, duration, inclusions, and policies directly from your official
              website. Protected with SSRF filters and payload sanitization.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Website URL *</label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://www.divegohurghada.com/"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Or Paste Raw Page Text / Tour Description</label>
                <textarea
                  rows={3}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste excursion text or policies here if website is behind firewall..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">
                SSRF guard active (Localhost & private subnets blocked)
              </span>
              <button
                onClick={handleRunWebImport}
                disabled={isImporting}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isImporting ? 'Analyzing Website...' : 'Extract & Inspect'}</span>
              </button>
            </div>

            {/* Importer Output Preview */}
            {importResult && (
              <div className="bg-slate-800/80 border border-cyan-800/60 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span>Extracted Entities Found:</span>
                  <span className="text-[10px] text-slate-400">Source: {importResult.source}</span>
                </div>

                <div className="space-y-2 text-slate-300">
                  <p>
                    <strong>Company:</strong> {importResult.result?.companyName}
                  </p>
                  <p>
                    <strong>Excursions ({importResult.result?.extractedServices?.length || 0}):</strong>{' '}
                    {(importResult.result?.extractedServices || []).map((s: any) => `${s.title} (€${s.priceAdult})`).join(', ')}
                  </p>
                  <p>
                    <strong>Policies ({importResult.result?.extractedPolicies?.length || 0}):</strong>{' '}
                    {(importResult.result?.extractedPolicies || []).map((p: any) => p.subject).join(', ')}
                  </p>
                </div>

                <button
                  onClick={handleApplyImportedData}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Import Into Verified Inventory & Brain</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Operational Fact to Business Brain</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject / Fact Title *</label>
                <input
                  type="text"
                  required
                  value={newItem.subject}
                  onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
                  placeholder="e.g. Scuba Diving Nitrox Availability"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="pricing">Pricing & Rates</option>
                    <option value="policy">Policy / Cancellation</option>
                    <option value="location_pickup">Pickup / Areas</option>
                    <option value="service_detail">Service Specification</option>
                    <option value="faq">FAQ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Source Type (Precedence)</label>
                  <select
                    value={newItem.sourceType}
                    onChange={(e) => setNewItem({ ...newItem, sourceType: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="OWNER_VERIFIED">OWNER_VERIFIED (Weight: 100)</option>
                    <option value="MASTER_DB">MASTER_DB (Weight: 90)</option>
                    <option value="OFFICIAL_WEBSITE">OFFICIAL_WEBSITE (Weight: 70)</option>
                    <option value="AUTHORIZED_PLATFORM">AUTHORIZED_PLATFORM (Weight: 60)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Exact Operational Content *</label>
                <textarea
                  rows={3}
                  required
                  value={newItem.content}
                  onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                  placeholder="State the verified truth precisely..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                Save to Business Brain
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
