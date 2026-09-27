import React, { useState } from 'react';
import {
  ShieldCheck,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Award,
} from 'lucide-react';
import { TestScenarioResult } from '../types';
import { AuditTestRunner } from '../services/testRunner';

interface AuditTestingSuiteViewProps {
  onOpenAuditReport: () => void;
}

export const AuditTestingSuiteView: React.FC<AuditTestingSuiteViewProps> = ({ onOpenAuditReport }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: 20 });
  const [results, setResults] = useState<TestScenarioResult[]>([]);
  const [expandedScenarioId, setExpandedScenarioId] = useState<number | null>(null);

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress({ completed: 0, total: 20 });

    try {
      const finalResults = await AuditTestRunner.runAllScenarios((completed, total, currentRes) => {
        setProgress({ completed, total });
        setResults((prev) => [...prev, currentRes]);
      });
      setResults(finalResults);
    } catch (e: any) {
      alert(`Test runner error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter((r) => r.status === 'PASSED').length;
  const failedCount = results.filter((r) => r.status === 'FAILED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Master Verification Suite (§36, §37, §38)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">20 Critical Production Scenarios Test Runner</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live interactive verification of all 20 critical scenarios specified in Section 37. Proves zero-assumption
            onboarding, idempotency, prompt injection defense, cross-tenant isolation, and precedence rules.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunAllTests}
            disabled={isRunning}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/30 transition cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>
                  Testing {progress.completed}/{progress.total}...
                </span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Run All 20 Scenarios</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAuditReport}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            <Award className="h-4 w-4" />
            <span>View Certification Report</span>
          </button>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      {results.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">
              Suite Execution Progress: {results.length} / 20 Scenarios Complete
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>{passedCount} Passed</span>
              </span>
              {failedCount > 0 && (
                <span className="text-red-400 font-bold flex items-center space-x-1">
                  <XCircle className="h-4 w-4" />
                  <span>{failedCount} Failed</span>
                </span>
              )}
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 transition-all duration-300"
              style={{ width: `${(results.length / 20) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Scenario Results Feed */}
      <div className="space-y-3">
        {results.length === 0 && !isRunning && (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <FileCheck className="h-10 w-10 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">Test Runner Ready</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click "Run All 20 Scenarios" above to execute all 20 end-to-end production verification audits.
            </p>
          </div>
        )}

        {results.map((res) => {
          const isExpanded = expandedScenarioId === res.scenarioId;
          return (
            <div
              key={res.scenarioId}
              className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-md transition ${
                res.status === 'PASSED'
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-red-800/80 bg-red-950/10'
              }`}
            >
              <div
                onClick={() => setExpandedScenarioId(isExpanded ? null : res.scenarioId)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      res.status === 'PASSED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}
                  >
                    {res.scenarioId}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{res.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        {res.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{res.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{res.executionTimeMs}ms</span>
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      res.status === 'PASSED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {res.status}
                  </span>

                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Diagnostic Logs & Evidence */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/60 bg-slate-950/60 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider block mb-1">
                      Evidence of Verification (§4):
                    </span>
                    <p className="text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      {res.evidence}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider block mb-1">
                      Execution Logs:
                    </span>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300">
                      {res.logs.map((log, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-slate-500">›</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
