import React from 'react';
import { GameState } from '../game/types';
import { BOARD_SPACES } from '../game/constants';

interface PropertyModalProps {
  spaceId: number;
  state: GameState;
  onClose: () => void;
}

export function PropertyModal({ spaceId, state, onClose }: PropertyModalProps) {
  const space = BOARD_SPACES[spaceId];
  const propState = state.properties[spaceId];

  if (!space || !propState) return null;

  const owner = propState.ownerId !== null ? state.players.find(p => p.id === propState.ownerId) : null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl border-4 border-amber-900 w-full max-w-sm flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {space.type === 'property' && space.color ? (
          <div className={`${space.color} p-4 text-center border-b-4 border-amber-900`}>
            <h2 className="text-2xl font-black uppercase tracking-wider text-white drop-shadow-md">{space.name}</h2>
          </div>
        ) : (
          <div className="bg-amber-100 p-4 text-center border-b-4 border-amber-900">
            <h2 className="text-2xl font-black uppercase tracking-wider text-amber-900">{space.name}</h2>
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 bg-amber-50">
          
          {/* Rent Info */}
          <div className="bg-white p-4 rounded-lg border-2 border-amber-200 shadow-sm text-center">
            {space.type === 'property' && space.rent && (
              <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                <div className="flex justify-between font-bold text-gray-900 text-base mb-1">
                  <span>Rent</span>
                  <span className="font-mono">฿{space.rent[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>With 1 House</span>
                  <span className="font-mono text-green-700">฿{space.rent[1]}</span>
                </div>
                <div className="flex justify-between">
                  <span>With 2 Houses</span>
                  <span className="font-mono text-green-700">฿{space.rent[2]}</span>
                </div>
                <div className="flex justify-between">
                  <span>With 3 Houses</span>
                  <span className="font-mono text-green-700">฿{space.rent[3]}</span>
                </div>
                <div className="flex justify-between">
                  <span>With 4 Houses</span>
                  <span className="font-mono text-green-700">฿{space.rent[4]}</span>
                </div>
                <div className="flex justify-between font-bold text-red-700 mt-1 pt-1 border-t border-gray-200">
                  <span>With HOTEL</span>
                  <span className="font-mono">฿{space.rent[5]}</span>
                </div>
              </div>
            )}

            {space.type === 'railroad' && space.rent && (
              <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                <div className="flex justify-between">
                  <span>Rent</span>
                  <span className="font-mono">฿{space.rent[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>If 2 are owned</span>
                  <span className="font-mono">฿{space.rent[1]}</span>
                </div>
                <div className="flex justify-between">
                  <span>If 3 are owned</span>
                  <span className="font-mono">฿{space.rent[2]}</span>
                </div>
                <div className="flex justify-between">
                  <span>If 4 are owned</span>
                  <span className="font-mono">฿{space.rent[3]}</span>
                </div>
              </div>
            )}

            {space.type === 'utility' && (
              <div className="text-sm font-medium text-gray-700 text-left">
                <p className="mb-2">If one Utility is owned, rent is 4x amount shown on dice.</p>
                <p>If both Utilities are owned, rent is 10x amount shown on dice.</p>
              </div>
            )}
          </div>

          {/* Costs */}
          <div className="flex flex-col gap-2 text-sm font-bold text-gray-800">
            <div className="flex justify-between bg-white p-2 rounded border border-gray-200">
              <span>Property Value</span>
              <span className="font-mono text-amber-700">฿{space.price}</span>
            </div>
            {space.type === 'property' && space.houseCost && (
              <div className="flex justify-between bg-white p-2 rounded border border-gray-200">
                <span>House/Hotel Cost</span>
                <span className="font-mono text-amber-700">฿{space.houseCost} each</span>
              </div>
            )}
            <div className="flex justify-between bg-white p-2 rounded border border-gray-200">
              <span>Mortgage Value</span>
              <span className="font-mono text-amber-700">฿{Math.floor((space.price || 0) / 2)}</span>
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-2 p-3 rounded-lg border-2 border-blue-200 bg-blue-50 flex flex-col gap-2">
            <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-1">Current Status</h3>
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-gray-700">Owner:</span>
              {owner ? (
                <span className={`px-2 py-0.5 rounded text-white ${owner.color}`}>
                  {owner.icon} {owner.name}
                </span>
              ) : (
                <span className="text-gray-500 italic">Unowned</span>
              )}
            </div>
            
            {space.type === 'property' && owner && (
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-gray-700">Buildings:</span>
                <span className="text-green-700">
                  {propState.houses === 5 ? '1 Hotel' : `${propState.houses} Houses`}
                </span>
              </div>
            )}

            {propState.mortgaged && (
              <div className="text-center font-bold text-red-600 bg-red-100 border border-red-300 rounded p-1 mt-1">
                MORTGAGED
              </div>
            )}
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-amber-100 border-t-2 border-amber-200 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg transition-colors shadow-md w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
