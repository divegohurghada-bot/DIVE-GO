import React, { useState } from 'react';
import {
  Compass,
  RotateCcw,
  DownloadCloud,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Users,
  CheckCircle2,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { appStore } from '../services/store';
import { AppState } from '../services/store';

interface HeaderProps {
  state: AppState;
  onOpenAuditReport: () => void;
  onOpenOnboarding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onOpenAuditReport, onOpenOnboarding }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeConflictsCount = state.conflicts.filter((c) => c.status === 'OPEN').length;
  const pendingGapsCount = state.gaps.filter((g) => g.status === 'PENDING_OWNER_ANSWER').length;
  const tomorrowsBookings = appStore.getTomorrowsManifest();
  const tomorrowsPax = tomorrowsBookings.reduce((sum, b) => sum + b.adultsCount + b.childrenCount, 0);

  const handleReset = () => {
    appStore.resetToBlank();
    setShowResetConfirm(false);
  };

  const handleLoadProfile = () => {
    appStore.loadDiveGoHurghadaProfile();
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Compass className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  TRAVEL AI COMMAND CENTER
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                  Level 4 Certified
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span>{state.profile.isBlank ? '⚪ Virgin Unconfigured State' : state.profile.companyName}</span>
                {state.profile.website && (
                  <>
                    <span>•</span>
                    <a
                      href={state.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-0.5 underline decoration-cyan-500/40"
                    >
                      <span>divegohurghada.com</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* KPI Chips */}
          <div className="hidden lg:flex items-center space-x-3">
            {activeConflictsCount > 0 ? (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-950/60 border border-amber-800/70 rounded-lg text-amber-300 text-xs font-medium">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{activeConflictsCount} Price Conflict</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/70 rounded-lg text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>0 Conflicts</span>
              </div>
            )}

            {pendingGapsCount > 0 && (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-purple-950/60 border border-purple-800/70 rounded-lg text-purple-300 text-xs font-medium">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{pendingGapsCount} Knowledge Gap</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 px-3 py-1 bg-blue-950/60 border border-blue-800/70 rounded-lg text-blue-300 text-xs font-medium">
              <Users className="h-3.5 w-3.5" />
              <span>Tomorrow: {tomorrowsPax} Pax ({tomorrowsBookings.length} Trips)</span>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs font-medium">
              <span className="text-slate-400 px-2 py-1">Role:</span>
              {(['OWNER', 'ADMIN', 'STAFF', 'AUDITOR'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => appStore.setUserRole(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    state.userRole === r
                      ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Load Dive Go Hurghada Profile or Reset */}
            {state.profile.isBlank ? (
              <button
                onClick={handleLoadProfile}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
                title="1-Click Load Dive Go Hurghada Verified Business Data"
              >
                <DownloadCloud className="h-4 w-4" />
                <span>Load divegohurghada.com</span>
              </button>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer"
                title="Reset to Blank (Zero-Assumption Rule §5)"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Blank</span>
              </button>
            )}

            {/* Master Audit Report Button */}
            <button
              onClick={onOpenAuditReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-500 border border-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200">
            <div className="flex items-center space-x-3 text-amber-400 mb-4">
              <RotateCcw className="h-6 w-6" />
              <h3 className="text-lg font-bold text-white">Reset to Zero-Assumption Blank State?</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Per Section 5 of the Master Production Audit specification, this clears all company names, trips, prices,
              reservations, and keys to simulate a virgin first-run installation.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-600/30 transition"
              >
                Yes, Reset to Blank
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
