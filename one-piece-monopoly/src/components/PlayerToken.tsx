import React from 'react';

interface PlayerTokenProps {
  name: string;
  className?: string;
}

export function PlayerToken({ name, className = "w-6 h-6" }: PlayerTokenProps) {
  switch (name) {
    case 'Luffy':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Straw Hat */}
          <path d="M2 17C2 18.1046 6.47715 19 12 19C17.5228 19 22 18.1046 22 17" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6 16.5V11C6 7.68629 8.68629 5 12 5C15.3137 5 18 7.68629 18 11V16.5" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M6 14H18" stroke="#EF4444" strokeWidth="3.5"/>
        </svg>
      );
    case 'Zoro':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Three Swords */}
          {/* Blades */}
          <path d="M7 17L20 4M7 7L20 20M12 5V22" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round"/>
          {/* Hilts */}
          <path d="M4 20L7 17M4 4L7 7M12 2V5" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
          {/* Guards */}
          <path d="M6 16L8 18M6 8L8 6M10 5H14" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'Nami':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Tangerine */}
          <circle cx="12" cy="14" r="7" fill="#F97316" stroke="#C2410C" strokeWidth="1.5"/>
          {/* Highlight */}
          <path d="M9.5 11.5A3.5 3.5 0 0 1 13 10" stroke="#FFEDD5" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Leaf and Stem */}
          <path d="M12 7C10 5 8 5 8 5C8 5 9 7 9 9" fill="#22C55E" stroke="#14532D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'Sanji':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Fork and Knife */}
          {/* Fork */}
          <path d="M9 2V10C9 11.1046 8.10457 12 7 12C5.89543 12 5 11.1046 5 10V2" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 2V22" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Knife */}
          <path d="M17 2V22" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M17 2C19.2091 2 21 3.79086 21 6V10H17" fill="#E5E7EB" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Handles */}
          <path d="M7 14V22M17 14V22" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
  }
}
