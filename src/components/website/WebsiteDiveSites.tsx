import React, { useState } from 'react';
import { Compass, Waves, Anchor, Eye, Sparkles, Navigation, Fish } from 'lucide-react';

export const WebsiteDiveSites: React.FC = () => {
  const [selectedSiteIndex, setSelectedSiteIndex] = useState<number | null>(null);

  const sites = [
    {
      name: 'Shaab El Erg (Dolphin House)',
      type: 'Horseshoe Reef & Protected Lagoon',
      depth: '5 – 18 Meters',
      visibility: '30+ Meters',
      highlights: 'Resident pod of wild spinner dolphins, table corals, blue-spotted rays, hawksbill turtles.',
      level: 'All Levels (Divers & Snorkelers)',
      marineBio: 'Tursiops dolphins, blue-spotted stingrays, giant clams',
      coordinates: '27° 28\' N, 33° 53\' E',
      badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/60',
    },
    {
      name: 'Giftun Island Marine Reserve',
      type: 'National Park Reefs & Coral Gardens',
      depth: '8 – 25 Meters',
      visibility: '35 Meters',
      highlights: 'Lush gorgonian coral gardens, napoleon wrasse, schools of barracuda, crystal turquoise lagoons.',
      level: 'Open Water & Snorkelers',
      marineBio: 'Napoleon wrasse, clownfish anemones, moray eels',
      coordinates: '27° 14\' N, 33° 55\' E',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/60',
    },
    {
      name: 'Abu Ramada (The Aquarium)',
      type: 'Reef Pinnacle, Plateau & Wall',
      depth: '10 – 30 Meters',
      visibility: '30 Meters',
      highlights: 'Giant moray eels, bannerfish, clownfish anemones, eagle rays, gentle drift dives along drop-offs.',
      level: 'Certified Divers (OW / AOW)',
      marineBio: 'Spotted eagle rays, barracuda, glassfish swarms',
      coordinates: '27° 09\' N, 33° 59\' E',
      badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/60',
    },
    {
      name: 'Abu Nuhas Shipwreck Graveyard',
      type: 'Historical Shipwrecks (Red Sea Ridge)',
      depth: '12 – 32 Meters',
      visibility: '25 – 30 Meters',
      highlights: 'Carnatic (1869), Giannis D, Chrisoula K wrecks, covered in soft corals and glassfish colonies.',
      level: 'Advanced Open Water (AOW)',
      marineBio: 'Lionfish, glassfish, soft coral blooms, crocodile fish',
      coordinates: '27° 34\' N, 33° 55\' E',
      badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-950/60',
    },
  ];

  return (
    <section id="dive-sites" className="py-24 bg-slate-900/60 text-white border-t border-slate-900 relative overflow-hidden">
      {/* Dynamic Background Caustic Glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[400px] bg-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold mb-3">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>Hurghada Marine Destinations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 text-balance">
            Legendary Red Sea Dive Sites
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed text-balance">
            Hurghada enjoys warm, tranquil waters year-round with visibility exceeding 30 meters. Our captains choose
            daily dive spots dynamically each morning based on wind conditions and marine life movements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sites.map((site, i) => {
            const isHovered = selectedSiteIndex === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setSelectedSiteIndex(i)}
                onMouseLeave={() => setSelectedSiteIndex(null)}
                className={`bg-slate-900/90 border rounded-3xl p-7 shadow-xl space-y-5 transition-all duration-500 card-sheen relative cursor-pointer hover:-translate-y-2 ${
                  isHovered
                    ? 'border-cyan-400/60 shadow-2xl shadow-cyan-950/60'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Site Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 mb-1">
                      <Navigation className="h-3 w-3" />
                      <span>{site.type}</span>
                    </span>
                    <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                      {site.name}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold border shrink-0 transition-transform duration-300 ${
                      site.badgeColor
                    } ${isHovered ? 'scale-105' : ''}`}
                  >
                    {site.level}
                  </span>
                </div>

                {/* Highlights Card */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90">
                  {site.highlights}
                </p>

                {/* Marine Bio & Coordinates */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-1.5 text-cyan-300">
                    <Fish className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>Bio: {site.marineBio}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{site.coordinates}</span>
                </div>

                {/* Depth & Visibility Metrics Bar */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <div className="flex items-center space-x-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <Waves className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span>
                      Depth: <strong className="text-white">{site.depth}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                    <Eye className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>
                      Visibility: <strong className="text-white">{site.visibility}</strong>
                    </span>
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
