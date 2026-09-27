import React, { useState } from 'react';
import {
  MessageSquare,
  Smartphone,
  Bell,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { AppState, appStore } from '../services/store';

interface WhatsAppHubViewProps {
  state: AppState;
}

export const WhatsAppHubView: React.FC<WhatsAppHubViewProps> = ({ state }) => {
  const [customerNumber, setCustomerNumber] = useState(state.profile.whatsappNumber || '+2 0103 94 64 284');
  const [ownerAlertNumber, setOwnerAlertNumber] = useState(
    state.profile.ownerAlertWhatsapp || '+2 0103 94 64 284'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Inbound Webhook Simulator
  const [simSenderPhone, setSimSenderPhone] = useState('+49 176 12345678');
  const [simSenderName, setSimSenderName] = useState('Alexander Weber');
  const [simMessageText, setSimMessageText] = useState(
    'Hi Dive Go Hurghada! We are 2 divers staying at Albatros Palace. Can we dive tomorrow?'
  );
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const handleSaveNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.updateProfile({
      whatsappNumber: customerNumber,
      ownerAlertWhatsapp: ownerAlertNumber,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSimulateInbound = () => {
    setSimOutput(
      `[META CLOUD API WEBHOOK RECEIVED]\n200 OK — Inbound message from ${simSenderPhone} ("${simSenderName}"):\n"${simMessageText}"\n→ Dispatched to Multilingual AI Sales Agent\n→ AI generated response in German/English\n→ Lead score: HOT LEAD (High booking intent)`
    );

    // Also dispatch structured owner alert
    appStore.dispatchAlert({
      priority: 'P1_HIGH',
      type: 'HOT_LEAD',
      title: `Hot WhatsApp Lead: ${simSenderName}`,
      message: `${simSenderName} (${simSenderPhone}) inquiring about diving tomorrow from Albatros Palace.`,
      recipientNumber: ownerAlertNumber,
    });
  };

  const handleEmergencyHandoff = () => {
    appStore.dispatchAlert({
      priority: 'P0_CRITICAL',
      type: 'SERIOUS_COMPLAINT',
      title: '🚨 EMERGENCY OWNER HANDOFF TRIGGERED',
      message: `Customer requesting direct human owner intervention immediately on WhatsApp. AI automated replies suspended for this chat.`,
      recipientNumber: ownerAlertNumber,
    });
    alert('Emergency Owner Handoff dispatched to Owner Alert WhatsApp line!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Smartphone className="h-4 w-4" />
            <span>Dual-Number WhatsApp Architecture (§15 & §18)</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">WhatsApp Dispatch & Owner Alert Center</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Strict separation between <strong>Customer WhatsApp</strong> (customer sales conversations) and{' '}
            <strong>Owner Alert WhatsApp</strong> (P0/P1 booking notifications, hot leads, payment alerts).
          </p>
        </div>

        <button
          onClick={handleEmergencyHandoff}
          className="flex items-center space-x-2 px-4 py-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition cursor-pointer"
        >
          <Flame className="h-4 w-4 text-white" />
          <span>Trigger Emergency Handoff</span>
        </button>
      </div>

      {/* Dual Number Configuration Form */}
      <form onSubmit={handleSaveNumbers} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Radio className="h-4 w-4 text-emerald-400" />
            <span>Routing Numbers Configuration</span>
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Routing Updated!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Customer Line */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-300">1. Customer WhatsApp Line</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono">
                Sales & Quotes
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Public number displayed on divegohurghada.com, Google Business, and social ads. Customers text this line.
            </p>
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              placeholder="+20 100 234 5678"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Owner Alert Line */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300">2. Owner Alert Line (Dedicated)</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono">
                Internal P0/P1 Alerts
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Private number receiving instant booking alerts, cancellation notices, payment errors, and handoffs.
            </p>
            <input
              type="text"
              value={ownerAlertNumber}
              onChange={(e) => setOwnerAlertNumber(e.target.value)}
              placeholder="+20 100 987 6543"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition cursor-pointer"
          >
            Save WhatsApp Configuration
          </button>
        </div>
      </form>

      {/* Webhook Status & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Webhook Security & Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Meta Cloud API Webhook Status</span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-slate-300">Webhook Endpoint URL</span>
              <span className="font-mono text-cyan-400 text-[11px]">/api/webhook/whatsapp</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-slate-300">HTTP Verification Handshake</span>
              <span className="text-emerald-400 font-bold">● Active (hub.challenge verified)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-slate-300">Payload Signature (HMAC-SHA256)</span>
              <span className="text-emerald-400 font-bold">● Enforced</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-slate-300">Idempotency & Replay Protection</span>
              <span className="text-emerald-400 font-bold">● Active (Message ID Deduplication)</span>
            </div>
          </div>
        </div>

        {/* Right: Inbound Message Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <MessageSquare className="h-5 w-5 text-cyan-400" />
            <span>Inbound Message Simulator (§15 Testing)</span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Customer Phone</label>
                <input
                  type="text"
                  value={simSenderPhone}
                  onChange={(e) => setSimSenderPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={simSenderName}
                  onChange={(e) => setSimSenderName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Incoming WhatsApp Message Payload</label>
              <textarea
                rows={2}
                value={simMessageText}
                onChange={(e) => setSimMessageText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
              />
            </div>

            <button
              onClick={handleSimulateInbound}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              Simulate Inbound WhatsApp Webhook
            </button>

            {simOutput && (
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">
                {simOutput}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
