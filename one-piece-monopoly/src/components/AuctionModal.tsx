import React, { useState, useEffect } from 'react';
import { GameState } from '../game/types';
import { BOARD_SPACES } from '../game/constants';
import { PlayerToken } from './PlayerToken';

export function AuctionModal({ state, dispatch }: { state: GameState, dispatch: any }) {
  const auction = state.auction;
  if (!auction) return null;

  const space = BOARD_SPACES[auction.spaceId];
  const currentBidderId = auction.activeBidders[auction.currentBidderIndex];
  const currentBidder = state.players.find(p => p.id === currentBidderId)!;
  const highestBidder = auction.highestBidderId !== null ? state.players.find(p => p.id === auction.highestBidderId) : null;

  const minBid = auction.currentBid === 0 ? 10 : auction.currentBid + 10;
  const [bidAmount, setBidAmount] = useState(minBid);

  useEffect(() => {
    setBidAmount(minBid);
  }, [minBid]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-amber-900 w-full max-w-md flex flex-col overflow-hidden">
        <div className="bg-amber-800 text-white p-4 text-center">
          <h2 className="text-2xl font-bold">Property Auction</h2>
          <p className="text-amber-200 text-sm">{space.name}</p>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border border-gray-300">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${space.color || 'bg-gray-400'}`} />
              <span className="font-bold">{space.name}</span>
            </div>
            <span className="text-gray-500 text-sm">Value: ฿{space.price}</span>
          </div>

          <div className="text-center py-4">
            <p className="text-gray-600 text-sm uppercase tracking-wider font-bold">Current Highest Bid</p>
            <p className="text-4xl font-mono font-bold text-green-700">฿{auction.currentBid}</p>
            <p className="text-sm text-gray-500 mt-1">
              {highestBidder ? `by ${highestBidder.name}` : 'No bids yet'}
            </p>
          </div>

          <div className={`p-4 rounded-lg border-2 ${currentBidder.color.replace('bg-', 'border-')} bg-opacity-10`}>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentBidder.color} border-2 border-white shadow-sm text-white`}>
                <PlayerToken name={currentBidder.name} className="w-5 h-5" />
              </div>
              {currentBidder.name}'s Turn to Bid
            </h3>
            <p className="text-sm text-gray-600 mb-4">Available Funds: ฿{currentBidder.money}</p>
            
            <div className="flex gap-2">
              <input 
                type="number" 
                min={minBid} 
                max={currentBidder.money}
                step="10"
                value={bidAmount}
                onChange={e => setBidAmount(Number(e.target.value))}
                className="flex-1 border border-gray-300 rounded px-3 py-2 font-mono"
              />
              <button 
                onClick={() => dispatch({ type: 'PLACE_BID', amount: bidAmount })}
                disabled={bidAmount < minBid || bidAmount > currentBidder.money}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded transition-colors"
              >
                Bid
              </button>
              <button 
                onClick={() => dispatch({ type: 'FOLD_AUCTION' })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors"
              >
                Fold
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
