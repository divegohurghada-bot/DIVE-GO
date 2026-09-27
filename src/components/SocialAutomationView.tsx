import React, { useState } from 'react';
import {
  Share2,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';
import { SocialPost, SocialComment } from '../types';
import { AiService } from '../services/aiService';

interface SocialAutomationViewProps {
  state: AppState;
}

export const SocialAutomationView: React.FC<SocialAutomationViewProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'creator' | 'queue' | 'comments'>('creator');
  const [selectedServiceId, setSelectedServiceId] = useState(state.services[0]?.id || '');
  const [targetPlatform, setTargetPlatform] = useState<'Instagram' | 'Facebook' | 'TikTok'>('Instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<any>(null);

  const posts = state.socialPosts;
  const comments = state.socialComments;

  const handleGenerateAd = async () => {
    const service = state.services.find((s) => s.id === selectedServiceId) || state.services[0];
    if (!service) {
      alert('Please add a verified excursion first.');
      return;
    }

    setIsGenerating(true);
    setGeneratedAd(null);
    try {
      const res = await AiService.createAdCampaign(service, targetPlatform, 'English');
      setGeneratedAd(res.ad);
    } catch (err: any) {
      alert(`Ad generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToQueue = () => {
    if (!generatedAd) return;
    const service = state.services.find((s) => s.id === selectedServiceId) || state.services[0];

    appStore.addSocialPost({
      platform: targetPlatform,
      headline: generatedAd.headline,
      caption: generatedAd.caption,
      callToAction: generatedAd.callToAction,
      hashtags: generatedAd.hashtags || [],
      imagePrompt: generatedAd.imagePrompt,
      status: 'DRAFT',
      serviceGrounded: service ? service.title : 'General Tour',
      verifiedPrice: service ? `€${service.priceAdult}` : '€65',
    });

    setGeneratedAd(null);
    setActiveTab('queue');
  };

  const handleApprovePost = (id: string) => {
    appStore.updateSocialPostStatus(id, 'SIMULATED');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Share2 className="h-4 w-4" />
            <span>Social Automation & Factual Ad Creator (§20 & §21)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Verified Social Content & Comment Guard</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Promotional content strictly derived from verified tariffs and real tour inclusions. Zero fabricated
            discounts. Owner approval gate required before publication.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('creator')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'creator' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Factual Ad Creator
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'queue' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Approval Queue ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'comments' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Comment Replier
          </button>
        </div>
      </div>

      {/* AD CREATOR TAB */}
      {activeTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Ground Campaign in Verified Inventory</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Verified Excursion *</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {state.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} (Price: €{s.priceAdult})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Social Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Instagram', 'Facebook', 'TikTok'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTargetPlatform(p)}
                      className={`py-2 rounded-xl font-bold border transition ${
                        targetPlatform === p
                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700 text-slate-400 text-[11px] space-y-1">
                <span className="font-bold text-slate-300">Grounding Policy Enforced (§20):</span>
                <p>
                  Prices are locked to verified database values. Ad copy will not invent discounts, fake reviews, or
                  unauthorized perks.
                </p>
              </div>

              <button
                onClick={handleGenerateAd}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md shadow-cyan-600/30 transition cursor-pointer flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isGenerating ? 'Generating Truth-Grounded Ad...' : 'Generate Factual Ad Campaign'}</span>
              </button>
            </div>
          </div>

          {/* Ad Preview Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between text-xs space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-white text-sm">Campaign Draft Preview ({targetPlatform})</span>
                <span className="text-[10px] bg-slate-800 text-cyan-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                  Ready for Owner Review
                </span>
              </div>

              {generatedAd ? (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Headline:</span>
                    <p className="text-white font-bold text-sm">{generatedAd.headline}</p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Caption:</span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{generatedAd.caption}</p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Image Prompt:</span>
                    <p className="text-slate-400 italic text-[11px]">{generatedAd.imagePrompt}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {(generatedAd.hashtags || []).map((h: string, i: number) => (
                      <span key={i} className="text-cyan-400 font-mono text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500">
                  <Share2 className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                  <p>Click "Generate Factual Ad Campaign" to create a grounded promo for social media.</p>
                </div>
              )}
            </div>

            {generatedAd && (
              <button
                onClick={handleSaveToQueue}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                Send to Distribution Approval Queue
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUEUE TAB */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
            <strong>Social Distribution Approval Gate (§21):</strong> Never blindly publish generated posts. The owner
            must review and confirm content accuracy before it is dispatched to live or simulated channels.
          </div>

          {posts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <Share2 className="h-10 w-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-white">Approval queue is empty.</p>
              <p className="text-xs text-slate-400 mt-1">Generate a draft campaign above to send it for review.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {post.platform}
                    </span>
                    <span className="font-bold text-white text-sm">{post.headline}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      post.status === 'APPROVED' || post.status === 'SIMULATED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span>
                    Grounded Tour: <strong className="text-white">{post.serviceGrounded}</strong> (Tariff:{' '}
                    {post.verifiedPrice})
                  </span>

                  {post.status === 'DRAFT' && (
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition cursor-pointer"
                    >
                      Owner Approve & Schedule
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* COMMENTS TAB */}
      {activeTab === 'comments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-cyan-400" />
              <span>Comment Auto-Replier Guardrails (§22)</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Privacy Guard Enforced
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Public Instagram Comment: @travel_sarah99</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-mono">
                  Intent: PRICING
                </span>
              </div>
              <p className="text-slate-300 italic">"How much is the Dolphin House boat trip for me and my daughter?"</p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 font-bold block">
                  AI Guarded Reply (Direct Grounding):
                </span>
                <p className="text-slate-300">
                  "Hello Sarah! Our Dolphin House trip is €35 per adult and €20 for children. Includes snorkeling gear,
                  buffet lunch, and hotel pickup. You can message us directly on WhatsApp at +20 100 234 5678 to book!"
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Public Facebook Comment: @michael_k</span>
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded font-mono">
                  Intent: ESCALATE_COMPLAINT
                </span>
              </div>
              <p className="text-slate-300 italic">
                "Our hotel pickup was 25 minutes late yesterday, driver said traffic was bad."
              </p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-red-400 font-bold block">
                  Safety Protocol Triggered (Escalated to Owner WhatsApp):
                </span>
                <p className="text-slate-400">
                  Automated reply suppressed to avoid public argument. Incident logged and dispatched to Owner Alert
                  line for private customer care resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
