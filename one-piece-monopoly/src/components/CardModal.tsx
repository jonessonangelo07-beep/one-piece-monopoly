import React from 'react';
import { GameState } from '../game/types';

interface CardModalProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
}

export function CardModal({ state, dispatch }: CardModalProps) {
  if (!state.activeCard) return null;

  const { type, card } = state.activeCard;
  const isChance = type === 'chance';
  const title = isChance ? 'Log Pose (Chance)' : 'Bounty Poster (Community Chest)';
  const bgColor = isChance ? 'bg-orange-500' : 'bg-yellow-400';
  const textColor = isChance ? 'text-white' : 'text-amber-900';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-xl shadow-2xl border-4 border-amber-900 flex flex-col overflow-hidden bg-amber-50`}>
        
        <div className={`${bgColor} p-4 text-center border-b-4 border-amber-900`}>
          <h2 className={`text-2xl font-black uppercase tracking-wider ${textColor} drop-shadow-md`}>
            {title}
          </h2>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[200px] text-center gap-4">
          <p className="text-xl font-black text-gray-800 leading-relaxed uppercase tracking-wide">
            {card.text}
          </p>
          <p className="text-md font-medium text-gray-600 bg-amber-100/50 p-3 rounded-lg border border-amber-200">
            {card.description}
          </p>
        </div>
        
        <div className="p-4 bg-amber-100 border-t-2 border-amber-200 text-center">
          <button 
            onClick={() => dispatch({ type: 'RESOLVE_CARD' })}
            className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors shadow-md w-full text-lg uppercase tracking-wider"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
