import React from 'react';
import { motion } from 'motion/react';

const Pip = ({ className }: { className: string }) => (
  <div className={`absolute w-2.5 h-2.5 bg-gray-800 rounded-full shadow-inner ${className}`} />
);

export function ThematicDie({ value, rollCount, isDouble }: { value: number, rollCount: number, isDouble?: boolean }) {
  const isSix = value === 6;

  return (
    <motion.div 
      key={rollCount}
      initial={{ y: -60, rotateX: 360, rotateY: 360, rotateZ: -90, scale: 0.3, opacity: 0 }}
      animate={{ 
        y: [-60, 0, -15, 0, -4, 0],
        rotateX: [360, 0, 0, 0, 0, 0],
        rotateY: [360, 0, 0, 0, 0, 0],
        rotateZ: [-90, 20, -10, 5, -2, 0],
        scale: [0.3, 1.1, 0.95, 1.02, 0.98, 1],
        opacity: [0, 1, 1, 1, 1, 1],
        boxShadow: isSix 
          ? "0px 0px 15px 5px rgba(239, 68, 68, 0.6)" 
          : (isDouble ? "0px 0px 15px 5px rgba(250, 204, 21, 0.6)" : "0px 4px 6px -1px rgba(0,0,0,0.1)")
      }}
      transition={{ 
        duration: 0.7,
        times: [0, 0.4, 0.6, 0.75, 0.9, 1],
        ease: ["easeIn", "easeOut", "easeInOut", "easeInOut", "easeInOut"]
      }}
      className={`relative w-12 h-12 rounded-xl border-2 shadow-md ${
        isSix ? 'bg-gray-900 border-red-500' : 
        isDouble ? 'bg-yellow-50 border-yellow-500' : 
        'bg-white border-gray-300'
      }`}
    >
      {value === 1 && <Pip className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
      
      {value === 2 && (
        <>
          <Pip className="top-2 left-2" />
          <Pip className="bottom-2 right-2" />
        </>
      )}
      
      {value === 3 && (
        <>
          <Pip className="top-2 left-2" />
          <Pip className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Pip className="bottom-2 right-2" />
        </>
      )}
      
      {value === 4 && (
        <>
          <Pip className="top-2 left-2" />
          <Pip className="top-2 right-2" />
          <Pip className="bottom-2 left-2" />
          <Pip className="bottom-2 right-2" />
        </>
      )}
      
      {value === 5 && (
        <>
          <Pip className="top-2 left-2" />
          <Pip className="top-2 right-2" />
          <Pip className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <Pip className="bottom-2 left-2" />
          <Pip className="bottom-2 right-2" />
        </>
      )}

      {value === 6 && (
        <div className="absolute inset-0 flex items-center justify-center p-1.5">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="#f3f4f6">
            {/* Crossbones */}
            <path d="M 15 15 L 85 85 M 85 15 L 15 85" stroke="#f3f4f6" strokeWidth="12" strokeLinecap="round" />
            {/* Skull Base */}
            <path d="M 50 15 C 25 15 25 45 25 55 C 25 65 35 70 35 70 L 35 85 L 65 85 L 65 70 C 65 70 75 65 75 55 C 75 45 75 15 50 15 Z" />
            {/* Eyes */}
            <circle cx="38" cy="45" r="8" fill="#111827" />
            <circle cx="62" cy="45" r="8" fill="#111827" />
            {/* Nose */}
            <path d="M 50 55 L 46 63 L 54 63 Z" fill="#111827" />
            {/* Teeth */}
            <line x1="42" y1="75" x2="42" y2="85" stroke="#111827" strokeWidth="3" />
            <line x1="50" y1="75" x2="50" y2="85" stroke="#111827" strokeWidth="3" />
            <line x1="58" y1="75" x2="58" y2="85" stroke="#111827" strokeWidth="3" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
