import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const WebsiteFaq: React.FC = () => {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is your cancellation and refund policy?',
      a: 'We offer a flexible 24-hour free cancellation policy. If your holiday plans change or you feel unwell, you can cancel your excursion up to 24 hours prior to scheduled departure for a 100% full refund with zero fees.',
    },
    {
      q: 'Which hotel areas in Hurghada are included in the free pickup?',
      a: 'Complimentary round-trip transfers are included for all hotels within Hurghada City, El Mamsha Promenade, Dahar Old Town, and Sahl Hasheesh. For hotels located in Makadi Bay, Soma Bay, or El Gouna, a nominal roundtrip transfer surcharge of €5 per person applies.',
    },
    {
      q: 'Do I need diving certification to experience scuba diving?',
      a: 'Not at all! Our "Discover Scuba Diving" (Introductory Dive) program is designed specifically for complete beginners. You will receive a full safety briefing on the boat and make 2 relaxed reef dives accompanied 1-on-1 by a certified PADI instructor up to 6–8 meters depth.',
    },
    {
      q: 'What meals and drinks are included on the daily boat excursions?',
      a: 'Every full-day boat excursion includes a freshly cooked buffet lunch prepared by the onboard chef (grilled chicken, fish, pasta, rice, fresh salads, and Egyptian specialties), plus unlimited soft drinks, mineral water, tea, and coffee throughout the day.',
    },
    {
      q: 'Can children join the boat and dolphin snorkeling trips?',
      a: 'Yes, absolutely! Families are warmly welcomed. Children under 4 years old join for free. Children aged 4 to 11 receive our discounted child tariff. We have dedicated child-size life jackets and snorkeling equipment on board.',
    },
    {
      q: 'What payment currencies and methods do you accept?',
      a: 'You can choose to pay cash on arrival on the morning of your trip in EUR (€), USD ($), GBP (£), or Egyptian Pounds (EGP). We also accept online credit card deposits and instant bank transfers.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>DiveGo Hurghada</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 text-balance">
            {t.nav.faq}
          </h2>
          <p className="text-sm text-slate-400 text-balance leading-relaxed">
            Everything you need to know about direct online booking, hotel pickups, equipment, and medical guidelines.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-300 border ${
                  isOpen
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-950/40'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 cursor-pointer"
                >
                  <span className={`font-bold text-sm sm:text-base transition-colors ${isOpen ? 'text-cyan-300' : 'text-white'}`}>
                    {faq.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-full transition-all duration-300 shrink-0 ${
                      isOpen ? 'bg-cyan-500/20 text-cyan-400 rotate-180' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
