import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface SocialMediaBarProps {
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const SocialMediaBar: React.FC<SocialMediaBarProps> = ({
  className = '',
  iconSize = 'md',
  showLabels = false,
}) => {
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/people/DiveGo-Hurghada/61593699815956/',
      ariaLabel: 'Dive Go Hurghada Facebook Page',
      hoverColor: 'hover:text-[#1877F2] hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
      icon: (sizeClass: string) => (
        <svg className={sizeClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/dive_go.hurghada',
      ariaLabel: 'Dive Go Hurghada Instagram Profile',
      hoverColor: 'hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10',
      icon: (sizeClass: string) => (
        <svg className={sizeClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@dive_go_hurghada',
      ariaLabel: 'Dive Go Hurghada TikTok',
      hoverColor: 'hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10',
      icon: (sizeClass: string) => (
        <svg className={sizeClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.95-4.52V8.09a8.16 8.16 0 0 0 4.82 1.57V6.69z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      url: 'mailto:divegohurghada@gmail.com',
      ariaLabel: 'Email Dive Go Hurghada',
      hoverColor: 'hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-400/10',
      icon: (sizeClass: string) => <Mail className={sizeClass} />,
    },
    {
      name: 'Phone',
      url: 'tel:+201039464284',
      ariaLabel: 'Call Dive Go Hurghada',
      hoverColor: 'hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-400/10',
      icon: (sizeClass: string) => <Phone className={sizeClass} />,
    },
  ];

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-4.5 w-4.5',
    lg: 'h-5 w-5',
  };

  const containerPadding = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((item) => (
        <a
          key={item.name}
          href={item.url}
          target={item.url.startsWith('http') ? '_blank' : undefined}
          rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={item.ariaLabel}
          title={item.name}
          className={`${containerPadding[iconSize]} rounded-xl bg-slate-900 border border-slate-800 text-slate-300 transition-all duration-200 ${item.hoverColor} flex items-center space-x-1.5 hover:scale-105 shadow-sm`}
        >
          {item.icon(sizeClasses[iconSize])}
          {showLabels && <span className="text-xs font-semibold">{item.name}</span>}
        </a>
      ))}
    </div>
  );
};
