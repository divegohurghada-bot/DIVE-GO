import React from 'react';
import {
  Globe,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react';
import { AppState } from '../services/store';

interface PlatformConnectorsViewProps {
  state: AppState;
}

export const PlatformConnectorsView: React.FC<PlatformConnectorsViewProps> = ({ state }) => {
  const connectors = state.connectors;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="h-4 w-4" />
            <span>Honest Integrations Audit (§11, §38, §57)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">OTA & Marketplace Platform Connectors</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Never fabricate connection success. Each integration is classified with its official API name, OAuth
            requirements, verified scopes, rate limits, and explicit unsupported capabilities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Strict Anti-Pretense Rule (§63)</span>
          <span className="px-2.5 py-1 rounded-md bg-amber-950 text-amber-400 border border-amber-800 text-xs font-bold font-mono">
            CREDENTIALS REQUIRED
          </span>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {connectors.map((conn) => (
          <div
            key={conn.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition text-xs"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  {conn.category} Connection
                </span>
                <h3 className="text-lg font-bold text-white">{conn.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">{conn.officialApiName}</span>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                {conn.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-800/60 p-3 rounded-2xl border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 block">Auth Method:</span>
                <strong className="text-white">{conn.authType}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Rate Limit:</span>
                <strong className="text-white">{conn.rateLimitPerMin} req / min</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Required Scopes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {conn.scopes.map((s, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px] border border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Supported Capabilities */}
            <div className="space-y-1.5">
              <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Supported Capabilities:</span>
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                {conn.supportedActions.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Unsupported / Policy Restrictions */}
            <div className="space-y-1.5">
              <span className="font-bold text-red-400 text-[11px] uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Policy Boundaries & Unsupported Actions:</span>
              </span>
              <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[11px]">
                {conn.unsupportedActions.map((un, i) => (
                  <li key={i}>{un}</li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              Note: {conn.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
