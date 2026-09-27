import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Jump to top of page"
      className="fixed bottom-6 left-6 z-40 p-3.5 bg-slate-900/90 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-cyan-600/30 cursor-pointer animate-in fade-in zoom-in-75 duration-200"
      title="Jump to Top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
