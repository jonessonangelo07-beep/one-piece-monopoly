import React from 'react';
import { Space, Player, PropertyState } from '../game/types';
import { BOARD_SPACES } from '../game/constants';
import { PlayerToken } from './PlayerToken';
import { motion } from 'motion/react';

interface BoardProps {
  players: Player[];
  properties: Record<number, PropertyState>;
  onSpaceClick?: (id: number) => void;
}

export function Board({ players, properties, onSpaceClick }: BoardProps) {
  const getGridStyle = (id: number) => {
    let row, col;
    if (id >= 0 && id <= 10) {
      row = 11;
      col = 11 - id;
    } else if (id >= 11 && id <= 20) {
      row = 21 - id;
      col = 1;
    } else if (id >= 21 && id <= 30) {
      row = 1;
      col = id - 19;
    } else {
      row = id - 29;
      col = 11;
    }
    return { gridRow: row, gridColumn: col };
  };

  return (
    <div className="w-full max-w-3xl aspect-square bg-amber-100 p-2 rounded-xl shadow-2xl border-4 border-amber-900 relative">
      <div className="w-full h-full grid grid-cols-11 grid-rows-11 gap-1">
        <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-amber-50 rounded-lg flex flex-col items-center justify-center border-2 border-amber-800 opacity-90">
          <h1 className="text-4xl md:text-6xl font-black text-amber-900 tracking-widest uppercase rotate-[-45deg] drop-shadow-md">
            ONE PIECE
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-red-600 tracking-widest uppercase rotate-[-45deg] mt-2">
            Monopoly
          </h2>
        </div>

        {BOARD_SPACES.map((space) => {
          const style = getGridStyle(space.id);
          const isCorner = space.id % 10 === 0;
          const propState = properties[space.id];
          const owner = propState?.ownerId !== null ? players.find(p => p.id === propState?.ownerId) : null;

          return (
            <div
              key={space.id}
              style={style}
              onClick={() => onSpaceClick?.(space.id)}
              className={`relative flex flex-col items-center justify-between border border-amber-900 bg-white text-center ${isCorner ? 'p-1' : 'p-0.5'} ${onSpaceClick && (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') ? 'cursor-pointer hover:brightness-95 transition-all' : ''}`}
            >
              {space.type === 'property' && space.color && (
                <div className={`w-full h-1/4 ${space.color} border-b border-amber-900 flex justify-center items-center gap-0.5`}>
                  {propState?.houses > 0 && (
                    propState.houses < 5 ? (
                      Array.from({ length: propState.houses }).map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" fill="#22C55E" stroke="#14532D" strokeWidth="2" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 drop-shadow-sm">
                          <path d="M3 10L12 3L21 10V21H3V10Z" />
                        </svg>
                      ))
                    ) : (
                      <svg viewBox="0 0 24 24" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" className="w-4 h-4 md:w-5 md:h-5 drop-shadow-sm">
                        <path d="M3 21V7L12 2L21 7V21H3Z" />
                        <rect x="7" y="10" width="3" height="3" fill="#FEF08A" stroke="none" />
                        <rect x="14" y="10" width="3" height="3" fill="#FEF08A" stroke="none" />
                        <rect x="7" y="15" width="3" height="3" fill="#FEF08A" stroke="none" />
                        <rect x="14" y="15" width="3" height="3" fill="#FEF08A" stroke="none" />
                      </svg>
                    )
                  )}
                </div>
              )}
              
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                {space.icon && (
                  <span className="text-xs md:text-sm mb-0.5 drop-shadow-sm">{space.icon}</span>
                )}
                <span className="text-[0.45rem] md:text-[0.6rem] leading-tight font-bold text-gray-800 uppercase break-words w-full px-0.5">
                  {space.name}
                </span>
                {space.price && (
                  <span className="text-[0.4rem] md:text-[0.5rem] font-semibold text-gray-600 mt-0.5">
                    ฿{space.price}
                  </span>
                )}
              </div>

              {owner && (
                <div className={`absolute bottom-0 left-0 w-full h-1.5 ${owner.color}`} />
              )}

              {propState?.mortgaged && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 pointer-events-none">
                  <span className="text-white font-bold text-[0.4rem] md:text-[0.6rem] rotate-[-45deg] border-2 border-red-500 text-red-500 px-1 bg-black/80">
                    MORTGAGED
                  </span>
                </div>
              )}

              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-wrap justify-center gap-0.5 w-full pointer-events-none z-20">
                {players.filter(p => p.position === space.id).map(p => (
                  <motion.div
                    layoutId={`player-${p.id}`}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    key={p.id}
                    className={`flex items-center justify-center w-5 h-5 md:w-8 md:h-8 rounded-full ${p.color} border-2 border-white shadow-md text-white relative z-50`}
                    title={p.name}
                  >
                    <PlayerToken name={p.name} className="w-3 h-3 md:w-5 md:h-5" />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
