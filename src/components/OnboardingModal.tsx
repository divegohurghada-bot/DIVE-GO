import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Compass,
  Clock,
  Bot,
  CheckCircle2,
  ArrowRight,
  DownloadCloud,
  X,
} from 'lucide-react';
import { appStore, DIVE_GO_HURGHADA_PROFILE } from '../services/store';
import { BusinessProfile } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<BusinessProfile>({
    ...appStore.getState().profile,
  });

  if (!isOpen) return null;

  const handleQuickLoad = () => {
    appStore.loadDiveGoHurghadaProfile();
    onClose();
  };

  const handleSave = () => {
    appStore.updateProfile({
      ...formData,
      isBlank: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">AI TOURISM COMMAND CENTER ONBOARDING</h2>
              <p className="text-xs text-cyan-300/80">
                Zero-Assumption System Initializer — Structured Operational Interview (§6)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 1-Click Fast Track Banner */}
        <div className="bg-cyan-950/40 border-b border-cyan-800/40 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-cyan-300">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Targeting <strong>https://www.divegohurghada.com/</strong>?</span>
          </div>
          <button
            onClick={handleQuickLoad}
            className="flex items-center space-x-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            <span>1-Click Load divegohurghada.com Data</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 text-xs">
          {[
            { id: 1, label: '1. Business Profile', icon: Building2 },
            { id: 2, label: '2. Destinations & Scope', icon: Compass },
            { id: 3, label: '3. Operations & Rules', icon: Clock },
            { id: 4, label: '4. AI Sales Persona', icon: Bot },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = step === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStep(item.id as any)}
                className={`flex-1 py-3 px-2 flex items-center justify-center space-x-2 border-b-2 transition ${
                  isActive
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Business & Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Display Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Dive Go Hurghada"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Legal / Registered Entity</label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    placeholder="e.g. Dive Go Hurghada Red Sea Marine Excursions Ltd."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Website URL *</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.divegohurghada.com/"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="divegohurghada@gmail.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer WhatsApp Number *</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+2 0103 94 64 284"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Owner Alert WhatsApp (Dedicated) *</label>
                  <input
                    type="text"
                    value={formData.ownerAlertWhatsapp}
                    onChange={(e) => setFormData({ ...formData, ownerAlertWhatsapp: e.target.value })}
                    placeholder="+2 0103 94 64 284 (Receives P0/P1 Booking Alerts)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Base Location / Address</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Saqala Square، Hurghada First, Red Sea Governorate 84511"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Destinations, Years & Target Markets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Years of Operational Experience</label>
                  <input
                    type="number"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Primary Operating Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="EUR (€)">EUR (€) - European Standard</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="EGP (LE)">EGP (LE) - Egyptian Pounds</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">Company Story & Heritage</label>
                <textarea
                  rows={3}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Share your brand story, instructor certifications, boat safety gear, and commitment to marine conservation..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Operating Rules, Timezone & Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Local Operational Timezone</label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    placeholder="Africa/Cairo (UTC+2)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Service Operating Hours</label>
                  <input
                    type="text"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                    placeholder="07:30 - 21:00 EEST"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs space-y-2">
                <span className="font-bold text-slate-300">Mandatory Production Safeguards Active:</span>
                <ul className="list-disc list-inside text-slate-400 space-y-1">
                  <li>24-Hour Free Cancellation Rule enforced across all standard day trips</li>
                  <li>Hotel lobby pickup verification with room number required before dispatch</li>
                  <li>Medical questionnaire compliance check for all scuba diving activities</li>
                </ul>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                AI Sales Persona, Guardrails & Escalation Rules
              </h3>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tone</label>
                  <select
                    value={formData.aiTone}
                    onChange={(e) => setFormData({ ...formData, aiTone: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="friendly">Friendly & Welcoming</option>
                    <option value="formal">Formal & Luxury</option>
                    <option value="enthusiastic">Enthusiastic & High Energy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Detail Level</label>
                  <select
                    value={formData.aiDetailLevel}
                    onChange={(e) => setFormData({ ...formData, aiDetailLevel: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="short">Short & Concise</option>
                    <option value="balanced">Balanced</option>
                    <option value="detailed">In-depth & Thorough</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sales Strategy</label>
                  <select
                    value={formData.aiSalesOrientation}
                    onChange={(e) => setFormData({ ...formData, aiSalesOrientation: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="consultative">Consultative (Recommends best fit)</option>
                    <option value="informational">Informational (Answers strictly)</option>
                    <option value="proactive">Proactive (Closes booking)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Forbidden Promises (AI Will NEVER Promise These):
                </label>
                <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-1">
                  {formData.aiForbiddenPromises.map((p, i) => (
                    <div key={i} className="flex items-center space-x-2 text-red-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1) as any)}
            disabled={step === 1}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {step < 4 ? (
              <button
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Complete Onboarding & Activate System</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
