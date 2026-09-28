import React, { useState } from 'react';
import {
  Compass,
  Phone,
  Mail,
  Calendar,
  Menu,
  X,
} from 'lucide-react';
import { AppState } from '../../services/store';
import { SocialMediaBar } from '../common/SocialMediaBar';
import { LanguageSelector } from '../common/LanguageSelector';
import { GoogleDriveModal } from '../common/GoogleDriveModal';
import { useLanguage } from '../../context/LanguageContext';

interface WebsiteNavbarProps {
  state: AppState;
  onOpenBooking: (serviceId?: string) => void;
  onOpenAiChat: () => void;
  onSwitchToCommandCenter?: () => void;
}

export const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({
  state,
  onOpenBooking,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);

  const phone = state.profile.whatsappNumber || '+2 0103 94 64 284';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
        {/* Top Contact & Micro Social/Language Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 text-[11px] text-slate-300 py-1.5 px-4 sm:px-6 lg:px-8 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <a
                href="tel:+201039464284"
                className="flex items-center space-x-1.5 hover:text-emerald-400 transition font-mono"
                title="Call Dive Go Hurghada"
              >
                <Phone className="h-3 w-3 text-emerald-400" />
                <span>+2 0103 94 64 284</span>
              </a>
              <a
                href="mailto:divegohurghada@gmail.com"
                className="flex items-center space-x-1.5 hover:text-cyan-400 transition"
                title="Email Dive Go Hurghada"
              >
                <Mail className="h-3 w-3 text-cyan-400" />
                <span>divegohurghada@gmail.com</span>
              </a>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Saqala Square, Hurghada</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1">Follow Us:</span>
                <SocialMediaBar iconSize="sm" />
              </div>

              {/* 20-Language Selector */}
              <LanguageSelector variant="compact" />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Animated Interactive Logo & Wordmark */}
            <a href="#" className="flex items-center space-x-3.5 group cursor-pointer" aria-label="DiveGo Hurghada Home">
              <div className="logo-animated-container">
                {/* Rotating dynamic rainbow neon halo glow */}
                <div className="logo-halo pointer-events-none" />

                {/* Logo Frame */}
                <div className="relative h-12 w-12 rounded-2xl bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:border-cyan-400 group-hover:shadow-cyan-400/50 transition-all duration-300 overflow-hidden shrink-0 z-10">
                  <img
                    src="/src/assets/divego_logo.png"
                    alt="DiveGo Hurghada Logo"
                    className="h-full w-full object-contain logo-img-pulse"
                  />
                </div>
              </div>

              <div>
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 group-hover:from-cyan-300 group-hover:via-teal-200 group-hover:to-cyan-400 bg-clip-text text-transparent block transition-all duration-300">
                  DiveGo Hurghada
                </span>
                <span className="text-[11px] text-cyan-400/90 group-hover:text-cyan-300 font-medium block transition-colors duration-200">
                  {t.footer.tagline}
                </span>
              </div>
            </a>

            {/* Zone 2: Clean text navigation links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <a href="#excursions" className="hover:text-cyan-400 transition-colors">
                {t.nav.excursions}
              </a>
              <a href="#daily-diving" className="hover:text-cyan-400 transition-colors">
                {t.nav.dailyDiving}
              </a>
              <a href="#padi-courses" className="hover:text-cyan-400 transition-colors">
                {t.nav.padiCourses}
              </a>
              <a href="#dive-sites" className="hover:text-cyan-400 transition-colors">
                {t.nav.diveSites}
              </a>
              <a href="#about" className="hover:text-cyan-400 transition-colors">
                {t.nav.about}
              </a>
              <a href="#faq" className="hover:text-cyan-400 transition-colors">
                {t.nav.faq}
              </a>
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              {/* WhatsApp Direct Action */}
              <a
                href={`https://wa.me/${cleanPhone}?text=Hello%20Dive%20Go%20Hurghada!%20I%20would%20like%20to%20inquire%20about%20your%20trips.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 text-emerald-300 shadow-sm transition"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>{t.nav.whatsappDesk}</span>
              </a>

              {/* Instant Online Booking Action */}
              <button
                onClick={() => onOpenBooking()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>{t.nav.bookOnline}</span>
              </button>
            </div>

            {/* Mobile Menu Button with Language Indicator */}
            <div className="flex sm:hidden items-center space-x-2">
              <LanguageSelector variant="compact" />
              <button
                onClick={() => onOpenBooking()}
                className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold"
              >
                {t.nav.bookOnline}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 text-sm font-medium">
            <a
              href="#excursions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.excursions}
            </a>
            <a
              href="#daily-diving"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.dailyDiving}
            </a>
            <a
              href="#padi-courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.padiCourses}
            </a>
            <a
              href="#dive-sites"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.diveSites}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.about}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-300 hover:text-white"
            >
              {t.nav.faq}
            </a>

            <div className="pt-3 border-t border-slate-800 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-center rounded-xl font-bold cursor-pointer transition shadow-md shadow-cyan-600/30"
              >
                {t.nav.bookOnline}
              </button>

              <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  Follow DiveGo Hurghada:
                </span>
                <SocialMediaBar iconSize="md" />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
      />
    </>
  );
};
