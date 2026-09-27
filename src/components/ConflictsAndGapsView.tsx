import React, { useState } from 'react';
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  MessageSquare,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';

interface ConflictsAndGapsViewProps {
  state: AppState;
}

export const ConflictsAndGapsView: React.FC<ConflictsAndGapsViewProps> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<'conflicts' | 'gaps'>('conflicts');
  const [answeringGapId, setAnsweringGapId] = useState<string | null>(null);
  const [ownerAnswerText, setOwnerAnswerText] = useState('');

  const conflicts = state.conflicts;
  const gaps = state.gaps;

  const handleResolveConflict = (conflictId: string, choice: string) => {
    appStore.resolveConflict(
      conflictId,
      choice,
      `Owner confirmed authoritative value: ${choice}. Applied via Command Center.`
    );
  };

  const handleAnswerGap = (gapId: string) => {
    if (!ownerAnswerText.trim()) return;
    appStore.answerKnowledgeGap(gapId, ownerAnswerText.trim());
    setAnsweringGapId(null);
    setOwnerAnswerText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4" />
            <span>Auditing & Anti-Hallucination Systems (§8, §75, §76)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Knowledge Conflicts & Knowledge Gaps Engine</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            When customer questions or external platform prices clash, the system never silently hides the error. AI
            strictly refuses to fabricate answers and immediately flags missing facts for Owner Verification.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('conflicts')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'conflicts'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Price & Rule Conflicts ({conflicts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition ${
              activeTab === 'gaps'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Knowledge Gaps ({gaps.filter((g) => g.status === 'PENDING_OWNER_ANSWER').length})</span>
          </button>
        </div>
      </div>

      {/* CONFLICTS TAB */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
            <strong>Precedence Rule (§8):</strong> If Website lists Dolphin House at €35 and Viator lists €42, the
            precedence hierarchy enforces OWNER_VERIFIED (weight 100) over AUTHORIZED_PLATFORM (weight 60). The
            discrepancy is highlighted below for manual review.
          </div>

          {conflicts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <CheckCircle2 className="h-10 w-10 mx-auto text-emerald-400 mb-2" />
              <h3 className="text-base font-bold text-white">0 Unresolved Conflicts</h3>
              <p className="text-xs text-slate-400 mt-1">All verified sources and catalog prices are in full harmony.</p>
            </div>
          ) : (
            conflicts.map((conf) => (
              <div
                key={conf.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Discrepancy in field: {conf.field}
                    </span>
                    <h3 className="text-base font-bold text-white">{conf.subject}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      conf.status === 'RESOLVED_BY_RULE'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : conf.status === 'RESOLVED_BY_OWNER'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {conf.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Conflict Compare Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Source A */}
                  <div className="bg-slate-800/80 border border-emerald-800/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">Source A (High Priority)</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">
                        Weight: {conf.sourceA.priority}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm font-semibold">{conf.sourceA.value}</p>
                    <p className="text-slate-400 text-[11px]">Source: {conf.sourceA.source}</p>
                    <button
                      onClick={() => handleResolveConflict(conf.id, conf.sourceA.value)}
                      className="mt-2 w-full py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Enforce Source A Value
                    </button>
                  </div>

                  {/* Source B */}
                  <div className="bg-slate-800/80 border border-amber-800/60 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">Source B (External)</span>
                      <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-mono">
                        Weight: {conf.sourceB.priority}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm font-semibold">{conf.sourceB.value}</p>
                    <p className="text-slate-400 text-[11px]">Source: {conf.sourceB.source}</p>
                    <button
                      onClick={() => handleResolveConflict(conf.id, conf.sourceB.value)}
                      className="mt-2 w-full py-1.5 bg-amber-700/80 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Enforce Source B Value
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>
                    <strong>Resolution note:</strong> {conf.notes}
                  </span>
                  <span>Detected: {new Date(conf.detectedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* GAPS TAB */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
            <strong>Knowledge Gap Engine (§76 & §77):</strong> When a traveler asks an unverified question, the AI
            refuses to hallucinate. It responds politely that the operations desk will confirm, logs the question here,
            and alerts the Owner. Answering the question automatically adds it to the verified Business Brain!
          </div>

          {gaps.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <CheckCircle2 className="h-10 w-10 mx-auto text-purple-400 mb-2" />
              <h3 className="text-base font-bold text-white">No Unanswered Knowledge Gaps</h3>
              <p className="text-xs text-slate-400 mt-1">
                The AI Sales Agent has verified answers for all customer inquiries.
              </p>
            </div>
          ) : (
            gaps.map((gap) => (
              <div
                key={gap.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {gap.category}
                    </span>
                    <span className="text-xs text-slate-400">Language: {gap.customerLanguage}</span>
                    <span className="text-xs text-slate-400">Frequency: {gap.frequency}x</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      gap.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {gap.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-sm font-semibold text-white">
                  "{gap.question}"
                </div>

                {gap.status === 'RESOLVED' ? (
                  <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-emerald-400">Owner Verified Answer (Active in Brain):</span>
                    <p className="text-slate-300">{gap.ownerAnswer}</p>
                  </div>
                ) : (
                  <div>
                    {answeringGapId === gap.id ? (
                      <div className="space-y-2 pt-2">
                        <textarea
                          rows={2}
                          value={ownerAnswerText}
                          onChange={(e) => setOwnerAnswerText(e.target.value)}
                          placeholder="Type the official operational answer. It will be added to the AI Business Brain..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setAnsweringGapId(null)}
                            className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAnswerGap(gap.id)}
                            className="flex items-center space-x-1.5 px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Save Answer to Brain</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAnsweringGapId(gap.id);
                          setOwnerAnswerText('');
                        }}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Provide Owner Answer</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
