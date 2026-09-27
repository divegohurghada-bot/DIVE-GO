import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Users,
  Key,
  ShieldAlert,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AppState } from '../services/store';

interface SecurityAndAuditViewProps {
  state: AppState;
}

export const SecurityAndAuditView: React.FC<SecurityAndAuditViewProps> = ({ state }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const logs = state.auditLogs;

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.newValue && l.newValue.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Lock className="h-4 w-4" />
            <span>Enterprise Security & Multi-Tenancy (§24, §25, §29, §54)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Security Architecture & Audit Journal</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-tenant partition enforcement, role-based tool permission boundaries (READ vs WRITE vs HIGH-RISK), and
            immutable audit journal of all configuration changes.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Users className="h-4 w-4 text-cyan-400" />
          <span>
            Active Tenant: <strong className="text-white font-mono">{state.currentTenantId}</strong>
          </span>
        </div>
      </div>

      {/* Permission Tiers (§29) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Tier 1: READ */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span>Tier 1: READ Actions</span>
            <span className="bg-emerald-950 px-2 py-0.5 rounded text-[10px]">Autonomous</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            AI Sales Agent & Customer Desk can autonomously read excursion descriptions, verified prices, pickup
            locations, and cancellation policies.
          </p>
        </div>

        {/* Tier 2: WRITE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-blue-400 font-bold">
            <span>Tier 2: WRITE Actions</span>
            <span className="bg-blue-950 px-2 py-0.5 rounded text-[10px]">Staff / AI Draft</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Creating draft social media campaigns, recording customer notes, logging new reservations, and flagging
            knowledge gaps.
          </p>
        </div>

        {/* Tier 3: HIGH-RISK */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-red-400 font-bold">
            <span>Tier 3: HIGH-RISK Actions</span>
            <span className="bg-red-950 px-2 py-0.5 rounded text-[10px]">Owner Gate Required</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Modifying excursion prices, issuing cash refunds, publishing live social posts, or clearing business
            knowledge requires explicit Owner role authorization.
          </p>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Immutable Operational Audit Journal (§54)</span>
            </h2>
            <p className="text-xs text-slate-400">Complete forensic trail of every state modification</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[450px]">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700 sticky top-0">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">State Transition / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{log.actor}</div>
                    <span className="text-[10px] text-cyan-400 font-mono">[{log.role}]</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.entityId}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-sm truncate">
                    {log.newValue || log.previousValue || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
