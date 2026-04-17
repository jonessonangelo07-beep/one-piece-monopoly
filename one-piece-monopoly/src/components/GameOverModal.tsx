import React from 'react';
import { GameState } from '../game/types';
import { PlayerToken } from './PlayerToken';
import { motion } from 'motion/react';

export function GameOverModal({ state }: { state: GameState }) {
  const winner = state.players.find(p => !p.bankrupt);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white rounded-xl shadow-2xl border-4 border-amber-500 w-full max-w-lg flex flex-col overflow-hidden text-center"
      >
        <div className="bg-amber-500 text-white p-6">
          <h2 className="text-4xl font-black tracking-widest uppercase drop-shadow-md">GAME OVER</h2>
        </div>
        
        <div className="p-8 flex flex-col items-center gap-6">
          <div className={`flex items-center justify-center w-24 h-24 rounded-full ${winner.color} border-4 border-amber-400 shadow-lg text-white`}>
            <PlayerToken name={winner.name} className="w-14 h-14" />
          </div>
          
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">{winner.name} Wins!</h3>
            <p className="text-gray-600">They are the true Pirate King of Monopoly!</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-full shadow-lg transition-transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
