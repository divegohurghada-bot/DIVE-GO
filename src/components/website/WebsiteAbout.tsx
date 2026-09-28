import React from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  Anchor,
  Users,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { SocialMediaBar } from '../common/SocialMediaBar';
import { useLanguage } from '../../context/LanguageContext';

export const WebsiteAbout: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t.about.statsYears, value: '15+' },
    { label: t.about.statsDives, value: '25,000+' },
    { label: t.about.statsSafety, value: '100%' },
    { label: t.about.statsRating, value: '4.9 ★' },
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text & Interactive Pillars */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>{t.about.kicker}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
                {t.about.title}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t.about.p1}
            </p>

            <p className="text-sm text-slate-300 leading-relaxed">
              {t.about.p2}
            </p>

            {/* Quick Metrics Counter Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-center hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 block">
                    {s.value}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-medium leading-tight">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3.5 p-4 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white mb-0.5 group-hover:text-cyan-300 transition-colors">
                    {t.about.pillar1Title}
                  </h4>
                  <p className="text-slate-400">{t.about.pillar1Desc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
                    {t.about.pillar2Title}
                  </h4>
                  <p className="text-slate-400">{t.about.pillar2Desc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
                <div className="p-2 rounded-xl bg-blue-950 text-blue-400 border border-blue-800/80 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white mb-0.5 group-hover:text-blue-300 transition-colors">
                    {t.about.pillar3Title}
                  </h4>
                  <p className="text-slate-400">{t.about.pillar3Desc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 bg-slate-900/80 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300 group shadow-lg">
                <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/80 group-hover:scale-110 transition-transform">
                  <Anchor className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white mb-0.5 group-hover:text-amber-300 transition-colors">
                    {t.about.pillar4Title}
                  </h4>
                  <p className="text-slate-400">{t.about.pillar4Desc}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold">{t.about.community}</span>
              <SocialMediaBar iconSize="sm" />
            </div>
          </div>

          {/* Right Image / Showcase */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative aspect-4/3 bg-slate-800 card-sheen group">
              <img
                src="/src/assets/images/imported/contact_team.jpg"
                alt="DiveGo Hurghada Base & Team"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-xs text-slate-200 shadow-xl group-hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>DiveGo Hurghada Fleet & Center</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Located at Saqala Square, Hurghada First, with daily departures and complimentary hotel transfers across
                  Hurghada, Mamsha, Dahar, and Sahl Hasheesh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
