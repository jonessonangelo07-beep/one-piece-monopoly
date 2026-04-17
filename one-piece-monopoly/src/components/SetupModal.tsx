import React, { useState, useEffect } from 'react';
import { Player, GameState } from '../game/types';
import { INITIAL_MONEY, DEFAULT_PLAYERS } from '../game/useMonopoly';

interface SetupModalProps {
  onStart: (players: Player[]) => void;
  onLoad: (state: GameState) => void;
}

const AVAILABLE_COLORS = [
  { name: 'Red', color: 'bg-rose-600', border: 'border-rose-600', text: 'text-rose-600' },
  { name: 'Green', color: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-500' },
  { name: 'Orange', color: 'bg-amber-500', border: 'border-amber-500', text: 'text-amber-500' },
  { name: 'Blue', color: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-500' },
  { name: 'Purple', color: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-500' },
  { name: 'Pink', color: 'bg-pink-500', border: 'border-pink-500', text: 'text-pink-500' },
  { name: 'Yellow', color: 'bg-yellow-400', border: 'border-yellow-400', text: 'text-yellow-400' },
  { name: 'Gray', color: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-500' },
];

const AVAILABLE_ICONS = ['👒', '⚔️', '🍊', '🍴', '🦌', '🌸', '💀', '⚓', '🚢', '🏴‍☠️', '🍖', '💰'];

export function SetupModal({ onStart, onLoad }: SetupModalProps) {
  const [players, setPlayers] = useState<Partial<Player>[]>(
    DEFAULT_PLAYERS.map(p => ({ name: p.name, color: p.color, borderColor: p.borderColor, textColor: p.textColor, icon: p.icon }))
  );
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('one_piece_monopoly_save')) {
      setHasSave(true);
    }
  }, []);

  const handleLoad = () => {
    const saved = localStorage.getItem('one_piece_monopoly_save');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        onLoad(parsedState);
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  };

  const handleAddPlayer = () => {
    if (players.length >= 8) return;
    const usedColors = players.map(p => p.color);
    const availableColor = AVAILABLE_COLORS.find(c => !usedColors.includes(c.color)) || AVAILABLE_COLORS[0];
    
    const usedIcons = players.map(p => p.icon);
    const availableIcon = AVAILABLE_ICONS.find(i => !usedIcons.includes(i)) || AVAILABLE_ICONS[0];

    setPlayers([...players, { 
      name: `Player ${players.length + 1}`, 
      color: availableColor.color, 
      borderColor: availableColor.border, 
      textColor: availableColor.text, 
      icon: availableIcon,
      isBot: false
    }]);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length <= 2) return;
    setPlayers(players.filter((_, i) => i !== index));
  };

  const handleUpdatePlayer = (index: number, field: keyof Player, value: any) => {
    const newPlayers = [...players];
    if (field === 'color') {
      const colorObj = AVAILABLE_COLORS.find(c => c.color === value);
      if (colorObj) {
        newPlayers[index] = { ...newPlayers[index], color: colorObj.color, borderColor: colorObj.border, textColor: colorObj.text };
      }
    } else {
      newPlayers[index] = { ...newPlayers[index], [field]: value };
    }
    setPlayers(newPlayers);
  };

  const handleStart = () => {
    const finalPlayers: Player[] = players.map((p, i) => ({
      id: i,
      name: p.name || `Player ${i + 1}`,
      color: p.color!,
      borderColor: p.borderColor!,
      textColor: p.textColor!,
      icon: p.icon!,
      money: INITIAL_MONEY,
      position: 0,
      inJail: false,
      jailTurns: 0,
      bankrupt: false,
      getOutOfJailFreeCards: 0,
      isBot: p.isBot || false,
    }));
    onStart(finalPlayers);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border-4 border-amber-900 shadow-2xl max-w-2xl w-full my-8">
        <h2 className="text-3xl md:text-4xl font-black text-amber-900 mb-6 text-center tracking-wider uppercase">
          Crew Setup
        </h2>

        <div className="flex flex-col gap-4 mb-8">
          {players.map((player, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-xl border-2 border-amber-200 shadow-sm">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Name</label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleUpdatePlayer(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 font-semibold text-gray-800"
                  maxLength={15}
                />
              </div>
              
              <div className="w-full md:w-32">
                <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Color</label>
                <select
                  value={player.color}
                  onChange={(e) => handleUpdatePlayer(index, 'color', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 font-semibold text-gray-800 bg-white"
                >
                  {AVAILABLE_COLORS.map(c => (
                    <option key={c.color} value={c.color} disabled={players.some((p, i) => i !== index && p.color === c.color)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-24">
                <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Token</label>
                <select
                  value={player.icon}
                  onChange={(e) => handleUpdatePlayer(index, 'icon', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 text-xl bg-white text-center"
                >
                  {AVAILABLE_ICONS.map(icon => (
                    <option key={icon} value={icon} disabled={players.some((p, i) => i !== index && p.icon === icon)}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-20 flex flex-col items-center justify-center">
                <label className="block text-xs font-bold text-amber-800 uppercase mb-1">AI Bot</label>
                <input
                  type="checkbox"
                  checked={player.isBot || false}
                  onChange={(e) => handleUpdatePlayer(index, 'isBot', e.target.checked)}
                  className="w-6 h-6 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                />
              </div>

              <div className="w-full md:w-auto flex justify-end md:mt-5">
                <button
                  onClick={() => handleRemovePlayer(index)}
                  disabled={players.length <= 2}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  title="Remove Player"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={handleAddPlayer}
            disabled={players.length >= 8}
            className="w-full sm:w-auto px-6 py-3 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-xl transition-colors disabled:opacity-50 border-2 border-amber-400"
          >
            + Add Player
          </button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {hasSave && (
              <button
                onClick={handleLoad}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg border-2 border-blue-800"
              >
                Resume Game
              </button>
            )}
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-10 py-3 bg-green-600 hover:bg-green-700 text-white font-black text-xl rounded-xl transition-colors shadow-lg border-2 border-green-800"
            >
              SET SAIL!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
