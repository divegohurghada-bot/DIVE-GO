import React from 'react';
import { Compass, Phone, Mail, MapPin } from 'lucide-react';
import { AppState } from '../../services/store';
import { SocialMediaBar } from '../common/SocialMediaBar';
import { useLanguage } from '../../context/LanguageContext';

interface WebsiteFooterProps {
  state: AppState;
  onSwitchToCommandCenter?: () => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ state }) => {
  const { t } = useLanguage();
  const phone = state.profile.whatsappNumber || '+2 0103 94 64 284';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Social Follow */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3.5 group cursor-pointer">
              <div className="logo-animated-container">
                <div className="logo-halo pointer-events-none" />
                <div className="relative h-11 w-11 rounded-2xl bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:border-cyan-400 group-hover:shadow-cyan-400/50 transition-all duration-300 overflow-hidden shrink-0 z-10">
                  <img
                    src="/src/assets/divego_logo.png"
                    alt="DiveGo Hurghada Logo"
                    className="h-full w-full object-contain logo-img-pulse"
                  />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-base text-white block group-hover:text-cyan-300 transition-colors">
                  DiveGo Hurghada
                </span>
                <span className="text-[10px] text-cyan-400 font-medium">{t.footer.tagline}</span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="text-[11px] text-cyan-400 font-medium">
              15+ Jahre Erfahrung · 1000+ Zufriedene Taucher · 20 Sprachen 🌍
            </div>

            {/* Social Media Links with Icons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block mb-2">
                {t.footer.connectWithUs}
              </span>
              <SocialMediaBar iconSize="sm" />
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">Excursions</span>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>
                <a href="#daily-diving" className="hover:text-white transition">
                  Daily Boat Diving (2 Dives)
                </a>
              </li>
              <li>
                <a href="#excursions" className="hover:text-white transition">
                  Discover Scuba Diving (Beginners)
                </a>
              </li>
              <li>
                <a href="#excursions" className="hover:text-white transition">
                  Dolphin House Snorkeling Safari
                </a>
              </li>
              <li>
                <a href="#padi-courses" className="hover:text-white transition">
                  PADI Open Water Diver Course
                </a>
              </li>
              <li>
                <a href="#excursions" className="hover:text-white transition">
                  Super Desert Quad Safari & BBQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider block">Contact & Location</span>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Saqala Square، Hurghada First, Red Sea Governorate 84511</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href="tel:+201039464284"
                  className="hover:underline font-mono text-emerald-300"
                  title="Call Dive Go Hurghada"
                >
                  +2 0103 94 64 284
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a
                  href="mailto:divegohurghada@gmail.com"
                  className="hover:underline text-blue-300"
                  title="Email Dive Go Hurghada"
                >
                  divegohurghada@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hours & Departures */}
          <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <span className="font-bold text-white text-xs block">Hours & Departures</span>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <span className="text-slate-400">Desk Hours:</span> 07:30 – 21:00 Daily
              </li>
              <li>
                <span className="text-slate-400">Boat Departures:</span> 08:00 AM Daily
              </li>
              <li>
                <span className="text-slate-400">Hotel Transfers:</span> 07:30 – 08:15 AM
              </li>
              <li className="text-emerald-400 font-medium pt-1">
                ✓ 24-Hour Free Cancellation
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Dive Go Hurghada (
            <a href="https://www.divegohurghada.com/" target="_blank" rel="noreferrer" className="text-slate-400 hover:underline">
              https://www.divegohurghada.com/
            </a>
            ). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>24h Free Cancellation</span>
            <span>·</span>
            <span>PADI Certified</span>
            <span>·</span>
            <span>English, Deutsch, Français, العربية, Русский</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
