import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppState } from '../../services/store';
import { useLanguage } from '../../context/LanguageContext';

interface WebsiteHeroProps {
  state: AppState;
  onOpenBooking: (serviceId?: string, date?: string, pax?: number) => void;
  onOpenAiChat: () => void;
}

export const WebsiteHero: React.FC<WebsiteHeroProps> = ({ state, onOpenBooking }) => {
  const { t } = useLanguage();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedServiceId, setSelectedServiceId] = useState(state.services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(tomorrow);
  const [selectedPax, setSelectedPax] = useState(2);

  const handleSearchAndBook = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenBooking(selectedServiceId, selectedDate, selectedPax);
  };

  return (
    <section className="relative min-h-[680px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image with Dynamic Oceanic Sheen */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_red_sea_diving_1790535752456.jpg"
          alt="Scuba diving over vibrant coral reefs in Red Sea Hurghada"
          className="w-full h-full object-cover object-center filter brightness-90 scale-105 animate-float-slow duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient overlay for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/45" />

        {/* Floating Underwater Bubbles Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute bottom-0 left-[15%] w-3 h-3 bg-cyan-400/30 rounded-full blur-[1px]"
            style={{ animation: 'bubbleRise 6s infinite ease-in', animationDelay: '0s' }}
          />
          <div
            className="absolute bottom-0 left-[35%] w-2 h-2 bg-blue-300/40 rounded-full blur-[1px]"
            style={{ animation: 'bubbleRise 8s infinite ease-in', animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-0 left-[60%] w-4 h-4 bg-teal-300/25 rounded-full blur-[1px]"
            style={{ animation: 'bubbleRise 7s infinite ease-in', animationDelay: '1s' }}
          />
          <div
            className="absolute bottom-0 left-[82%] w-2.5 h-2.5 bg-cyan-200/30 rounded-full blur-[1px]"
            style={{ animation: 'bubbleRise 9s infinite ease-in', animationDelay: '3.5s' }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 text-center text-white">
        {/* Live Status & Trust Kicker */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 text-xs font-semibold text-cyan-300 mb-6 shadow-xl shadow-cyan-950/60 hover:border-cyan-400 hover:scale-105 transition-all duration-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            {t.hero.liveBadge}
          </span>
          <span className="text-slate-600">·</span>
          <span>{t.hero.tempVis}</span>
        </div>

        {/* Main Display Headline with Radiant Shimmer */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none text-balance mb-6">
          {t.hero.titlePrefix}{' '}
          <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-400 bg-clip-text text-transparent hover:from-cyan-200 hover:to-blue-300 transition-colors duration-500">
            {t.hero.titleHighlight}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-10 text-balance">
          {t.hero.desc}
        </p>

        {/* Trip Finder & Quick Booking Bar */}
        <form
          onSubmit={handleSearchAndBook}
          className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 hover:border-cyan-500/50 rounded-3xl p-4 sm:p-5 max-w-4xl mx-auto shadow-2xl shadow-black/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left text-xs transition-all duration-300 hover:shadow-cyan-900/20 card-sheen"
        >
          {/* Service Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.hero.selectExcursion}</span>
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              {state.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} (€{s.priceAdult})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.hero.excursionDate}</span>
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            />
          </div>

          {/* Guests Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>{t.hero.guests}</span>
            </label>
            <select
              value={selectedPax}
              onChange={(e) => setSelectedPax(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-white font-medium focus:outline-none focus:border-cyan-500 transition cursor-pointer"
            >
              <option value={1}>1 Pax</option>
              <option value={2}>2 Pax</option>
              <option value={3}>3 Pax</option>
              <option value={4}>4 Pax</option>
              <option value={5}>5+ Group</option>
            </select>
          </div>

          {/* CTA Submit Button with Glowing Pulse */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs h-[42px] group"
            >
              <span>{t.hero.checkRatesBtn}</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Interactive Trust Proof Badges with Hover Float */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-xs text-slate-300 font-medium">
          <div className="flex items-center justify-center space-x-2 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="group-hover:text-white transition-colors">{t.hero.yearsExp}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group">
            <ShieldCheck className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="group-hover:text-white transition-colors">{t.hero.padiSafety}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="group-hover:text-white transition-colors">{t.hero.freeCancel}</span>
          </div>

          <div className="flex items-center justify-center space-x-2 bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg cursor-default group">
            <MapPin className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="group-hover:text-white transition-colors">{t.hero.hotelTransfer}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
