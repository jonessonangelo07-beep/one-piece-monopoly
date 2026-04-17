import React from 'react';
import { GameState } from '../game/types';
import { PlayerToken } from './PlayerToken';

export function PlayerStats({ state }: { state: GameState }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-2 border-amber-800 flex flex-col gap-3">
      <h3 className="font-bold text-gray-800 border-b pb-2">Pirate Crews</h3>
      <div className="flex flex-col gap-2">
        {state.players.map((player, idx) => (
          <div
            key={player.id}
            className={`p-2 rounded-lg border-2 ${
              idx === state.currentPlayerIndex ? `${player.borderColor} bg-amber-50 shadow-md` : 'border-transparent'
            } flex items-center justify-between transition-all`}
          >
            <div className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${player.color} border-2 border-white shadow-sm text-white`}>
                <PlayerToken name={player.name} className="w-5 h-5" />
              </div>
              <span className={`font-semibold flex items-center gap-1 ${player.bankrupt ? 'line-through text-gray-400' : (idx === state.currentPlayerIndex ? player.textColor : 'text-gray-800')}`}>
                {player.name} <span className="text-lg">{player.icon}</span>
              </span>
              {player.inJail && (
                <span className="text-[0.6rem] bg-gray-800 text-white px-1 rounded">JAIL</span>
              )}
              {player.getOutOfJailFreeCards > 0 && (
                <span className="text-[0.6rem] bg-purple-600 text-white px-1 rounded ml-1" title="Get Out of Jail Free Cards">
                  🎫 {player.getOutOfJailFreeCards}
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-green-700">
              ฿{player.money}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
