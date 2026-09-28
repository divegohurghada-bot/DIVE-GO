import React, { useState } from 'react';
import {
  Clock,
  Users,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { AppState } from '../../services/store';
import { ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WebsiteExcursionsProps {
  state: AppState;
  onOpenBooking: (serviceId?: string) => void;
  onOpenAiChat: (prefilledQuery?: string) => void;
}

export const WebsiteExcursions: React.FC<WebsiteExcursionsProps> = ({
  state,
  onOpenBooking,
  onOpenAiChat,
}) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const getImageForService = (service: ServiceItem) => {
    const titleLower = service.title.toLowerCase();
    if (titleLower.includes('speedboat') || titleLower.includes('orange bay')) {
      return '/src/assets/images/orange_bay_speedboat_1790601426295.jpg';
    }
    if (service.category === 'desert_safari' || titleLower.includes('safari') || titleLower.includes('quad')) {
      return '/src/assets/images/desert_quad_sunset_1790601472549.jpg';
    }
    if (titleLower.includes('padi') || titleLower.includes('privat')) {
      return '/src/assets/images/padi_private_instructor_1790601441110.jpg';
    }
    if (titleLower.includes('tauchsafari') || titleLower.includes('wrack') || titleLower.includes('wreck')) {
      return '/src/assets/images/red_sea_wreck_safari_1790601457939.jpg';
    }
    if (titleLower.includes('dolphin') || titleLower.includes('delfin')) {
      return '/src/assets/images/wild_dolphins_snorkeling_1790601486695.jpg';
    }
    if (titleLower.includes('daily') || titleLower.includes('intro') || service.category === 'diving') {
      return '/src/assets/images/daily_scuba_coral_dive_1790601412136.jpg';
    }
    return '/src/assets/images/daily_scuba_coral_dive_1790601412136.jpg';
  };

  const filteredServices = state.services.filter((s) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'diving') return s.category === 'diving';
    if (activeFilter === 'sea_trip') return s.category === 'sea_trip';
    if (activeFilter === 'desert_safari') return s.category === 'desert_safari';
    return true;
  });

  return (
    <section id="excursions" className="py-24 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t.excursions.kicker}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 text-balance">
            {t.excursions.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed text-balance">
            {t.excursions.desc}
          </p>

          {/* Interactive Filter Control */}
          <div className="inline-flex flex-wrap justify-center p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl mt-8 gap-1.5 text-xs shadow-xl">
            {[
              { id: 'all', label: t.excursions.allFilter },
              { id: 'diving', label: t.excursions.divingFilter },
              { id: 'sea_trip', label: t.excursions.seaTripFilter },
              { id: 'desert_safari', label: t.excursions.safariFilter },
            ].map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/40 scale-102'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Excursions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const imgSrc = getImageForService(service);
            return (
              <div
                key={service.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-cyan-950/50 transition-all duration-500 flex flex-col group card-sheen hover:-translate-y-2"
              >
                {/* Visual Header with Image Zoom */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-800">
                  <img
                    src={imgSrc}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 group-hover:opacity-80 transition-opacity" />

                  {/* Category Chip */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold bg-slate-950/90 backdrop-blur-md text-cyan-300 border border-slate-700/80 shadow-md flex items-center space-x-1">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      <span>{service.category.replace('_', ' ').toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Price Tag with Glowing Gradient */}
                  <div className="absolute bottom-4 right-4 bg-slate-950/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-cyan-500/40 group-hover:border-cyan-400 group-hover:scale-105 transition-all text-right shadow-xl">
                    <span className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      €{service.priceAdult}
                    </span>
                    <span className="text-[10px] text-slate-400 block -mt-0.5">{t.excursions.perAdult}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="font-medium">{service.durationHours} {t.excursions.durationHours}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3.5 w-3.5 text-blue-400" />
                      <span className="font-medium">{t.excursions.childPrice}: €{service.priceChild || 'Free'}</span>
                    </div>
                  </div>

                  {/* Inclusions Highlights */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {t.excursions.inclusionsTitle}
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-300">
                      {service.inclusions.slice(0, 3).map((inc, i) => (
                        <span key={i} className="text-slate-300">
                          ✓ {inc}
                          {i < 2 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons with Dynamic Hover */}
                  <div className="pt-2 flex items-center space-x-2.5">
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer group/btn"
                    >
                      <span>{t.excursions.bookBtn}</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() =>
                        onOpenAiChat(
                          `Tell me more about the "${service.title}". What is the itinerary, meeting point, and what should I bring?`
                        )
                      }
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105"
                      title={t.excursions.askAiBtn}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
