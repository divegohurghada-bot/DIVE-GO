import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LANGUAGES, LanguageInfo } from '../../i18n';

interface LanguageSelectorProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { currentLang, currentLangInfo, setLang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = LANGUAGES.filter((l) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const handleSelect = (lang: LanguageInfo) => {
    setLang(lang.code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer group"
        title={t.nav.selectLanguage}
        aria-label="Select website language"
        aria-expanded={isOpen}
      >
        <span className="text-sm">{currentLangInfo.flag}</span>
        <span className="font-medium group-hover:text-cyan-300 transition-colors">
          {variant === 'expanded' ? currentLangInfo.nativeName : currentLang.toUpperCase()}
        </span>
        <Globe className="h-3.5 w-3.5 text-cyan-400 group-hover:rotate-45 transition-transform" />
      </button>

      {/* 20-Language Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                <span>20 Languages Available</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                autoFocus
              />
            </div>
          </div>

          {/* Languages Grid */}
          <div className="max-h-72 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-base">{lang.flag}</span>
                    <div className="truncate">
                      <span className="block truncate font-medium">{lang.nativeName}</span>
                      <span className="block text-[10px] text-slate-500">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Footer Notice */}
          <div className="p-2 border-t border-slate-800 bg-slate-950/80 text-center text-[10px] text-slate-400">
            Certified Red Sea Multi-Lingual Desk 🌊
          </div>
        </div>
      )}
    </div>
  );
};
