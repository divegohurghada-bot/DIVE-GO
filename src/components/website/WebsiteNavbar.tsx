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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phone = state.profile.whatsappNumber || '+2 0103 94 64 284';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      {/* Top Contact & Social Bar */}
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

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mr-1">Follow Us:</span>
            <SocialMediaBar iconSize="sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Single text element wordmark */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="h-11 w-11 rounded-2xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition overflow-hidden shrink-0">
              <img
                src="/src/assets/divego_logo.png"
                alt="DiveGo Hurghada Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent block">
                DiveGo Hurghada
              </span>
              <span className="text-[11px] text-cyan-400 font-medium block">
                Privater Tauchunterricht & Red Sea Marine Excursions
              </span>
            </div>
          </a>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-300">
            <a href="#excursions" className="hover:text-cyan-400 transition-colors">
              Excursions
            </a>
            <a href="#daily-diving" className="hover:text-cyan-400 transition-colors">
              Daily Diving
            </a>
            <a href="#padi-courses" className="hover:text-cyan-400 transition-colors">
              PADI Courses
            </a>
            <a href="#dive-sites" className="hover:text-cyan-400 transition-colors">
              Dive Sites
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">
              Reviews
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
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
              <span>WhatsApp Desk</span>
            </a>

            {/* Instant Online Booking Action */}
            <button
              onClick={() => onOpenBooking()}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition cursor-pointer"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Online</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-bold"
            >
              Book
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
            Excursions & Pricing
          </a>
          <a
            href="#daily-diving"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Daily Boat Diving
          </a>
          <a
            href="#padi-courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            PADI Diving Courses
          </a>
          <a
            href="#dive-sites"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            Red Sea Dive Sites
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            About Dive Go
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-white"
          >
            FAQ & Policies
          </a>

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-center rounded-xl font-bold cursor-pointer transition shadow-md shadow-cyan-600/30"
            >
              Book Excursion
            </button>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col items-center space-y-2">
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Follow Dive Go Hurghada:</span>
              <SocialMediaBar iconSize="md" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
