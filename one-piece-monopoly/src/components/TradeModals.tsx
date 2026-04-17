import React, { useState } from 'react';
import { GameState, TradeOffer } from '../game/types';
import { BOARD_SPACES } from '../game/constants';

export function TradeBuilderModal({ state, dispatch, onClose }: { state: GameState, dispatch: any, onClose: () => void }) {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const otherPlayers = state.players.filter(p => p.id !== currentPlayer.id && !p.bankrupt);
  
  const [targetPlayerId, setTargetPlayerId] = useState<number>(otherPlayers[0]?.id ?? -1);
  
  const [offerMoney, setOfferMoney] = useState(0);
  const [offerCards, setOfferCards] = useState(0);
  const [offerProps, setOfferProps] = useState<number[]>([]);
  
  const [reqMoney, setReqMoney] = useState(0);
  const [reqCards, setReqCards] = useState(0);
  const [reqProps, setReqProps] = useState<number[]>([]);

  if (targetPlayerId === -1) return null;

  const targetPlayer = state.players.find(p => p.id === targetPlayerId)!;

  const getTradableProperties = (playerId: number) => {
    return BOARD_SPACES.filter(s => {
      const propState = state.properties[s.id];
      if (propState?.ownerId !== playerId) return false;
      if (s.type !== 'property') return true;
      const groupSpaces = BOARD_SPACES.filter(g => g.group === s.group);
      const groupHasHouses = groupSpaces.some(g => (state.properties[g.id]?.houses || 0) > 0);
      return !groupHasHouses;
    });
  };

  const myProperties = getTradableProperties(currentPlayer.id);
  const theirProperties = getTradableProperties(targetPlayerId);

  const handlePropose = () => {
    const offer: TradeOffer = {
      fromPlayerId: currentPlayer.id,
      toPlayerId: targetPlayerId,
      offerMoney,
      offerCards,
      offerProperties: offerProps,
      requestMoney: reqMoney,
      requestCards: reqCards,
      requestProperties: reqProps,
    };
    dispatch({ type: 'PROPOSE_TRADE', offer });
    onClose();
  };

  const toggleProp = (id: number, list: number[], setList: (l: number[]) => void) => {
    if (list.includes(id)) setList(list.filter(x => x !== id));
    else setList([...list, id]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-amber-900 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-amber-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Propose Trade</h2>
          <button onClick={onClose} className="text-white hover:text-amber-200 font-bold text-xl">&times;</button>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-amber-50">
          <label className="font-bold text-gray-800 mr-2">Trade With:</label>
          <select 
            className="p-2 rounded border border-amber-300 bg-white"
            value={targetPlayerId} 
            onChange={e => {
              setTargetPlayerId(Number(e.target.value));
              setReqMoney(0);
              setReqCards(0);
              setReqProps([]);
            }}
          >
            {otherPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Your Offer */}
          <div className="flex flex-col gap-4 border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <div className="flex justify-between items-center border-b border-green-200 pb-2">
              <h3 className="font-bold text-lg text-green-800">Your Offer</h3>
              <div className="text-xs text-green-700 font-semibold flex gap-2">
                <span>฿{currentPlayer.money}</span>
                {currentPlayer.getOutOfJailFreeCards > 0 && <span>🎫 {currentPlayer.getOutOfJailFreeCards}</span>}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-100 shadow-sm">
              <label className="block text-sm font-bold text-green-900 mb-2 flex justify-between items-center">
                <span>Beli (Money)</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-green-700">฿</span>
                  <input
                    type="number"
                    min="0"
                    max={currentPlayer.money}
                    value={offerMoney}
                    onChange={e => setOfferMoney(Math.min(currentPlayer.money, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-1 border border-green-200 rounded text-right focus:outline-none focus:border-green-500 font-mono"
                  />
                </div>
              </label>
              <input 
                type="range" min="0" max={currentPlayer.money} step="10" 
                value={offerMoney} onChange={e => setOfferMoney(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>

            {currentPlayer.getOutOfJailFreeCards > 0 && (
              <div className="bg-white p-3 rounded border border-green-100 shadow-sm">
                <label className="block text-sm font-bold text-purple-900 mb-1 flex justify-between">
                  <span>Jail Cards</span>
                  <span className="font-mono text-purple-700">🎫 {offerCards}</span>
                </label>
                <input 
                  type="range" min="0" max={currentPlayer.getOutOfJailFreeCards} step="1" 
                  value={offerCards} onChange={e => setOfferCards(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            )}

            <div className="bg-white p-3 rounded border border-green-100 shadow-sm flex-1 flex flex-col">
              <label className="block text-sm font-bold text-blue-900 mb-2">Properties</label>
              <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-[100px]">
                {myProperties.length === 0 && <span className="text-sm text-gray-500 italic">No tradable properties.</span>}
                {myProperties.map(s => (
                  <label key={s.id} className="flex items-center gap-2 text-sm p-1 hover:bg-green-100 rounded cursor-pointer">
                    <input type="checkbox" checked={offerProps.includes(s.id)} onChange={() => toggleProp(s.id, offerProps, setOfferProps)} />
                    <div className={`w-3 h-3 rounded-full ${s.color || 'bg-gray-400'}`} />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: What You Want */}
          <div className="flex flex-col gap-4 border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex justify-between items-center border-b border-blue-200 pb-2">
              <h3 className="font-bold text-lg text-blue-800">What You Want</h3>
              <div className="text-xs text-blue-700 font-semibold flex gap-2">
                <span>฿{targetPlayer.money}</span>
                {targetPlayer.getOutOfJailFreeCards > 0 && <span>🎫 {targetPlayer.getOutOfJailFreeCards}</span>}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border border-blue-100 shadow-sm">
              <label className="block text-sm font-bold text-green-900 mb-2 flex justify-between items-center">
                <span>Beli (Money)</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-green-700">฿</span>
                  <input
                    type="number"
                    min="0"
                    max={targetPlayer.money}
                    value={reqMoney}
                    onChange={e => setReqMoney(Math.min(targetPlayer.money, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-1 border border-blue-200 rounded text-right focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </label>
              <input 
                type="range" min="0" max={targetPlayer.money} step="10" 
                value={reqMoney} onChange={e => setReqMoney(Number(e.target.value))}
                className="w-full accent-green-600"
              />
            </div>

            {targetPlayer.getOutOfJailFreeCards > 0 && (
              <div className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                <label className="block text-sm font-bold text-purple-900 mb-1 flex justify-between">
                  <span>Jail Cards</span>
                  <span className="font-mono text-purple-700">🎫 {reqCards}</span>
                </label>
                <input 
                  type="range" min="0" max={targetPlayer.getOutOfJailFreeCards} step="1" 
                  value={reqCards} onChange={e => setReqCards(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            )}

            <div className="bg-white p-3 rounded border border-blue-100 shadow-sm flex-1 flex flex-col">
              <label className="block text-sm font-bold text-blue-900 mb-2">Properties</label>
              <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-[100px]">
                {theirProperties.length === 0 && <span className="text-sm text-gray-500 italic">No tradable properties.</span>}
                {theirProperties.map(s => (
                  <label key={s.id} className="flex items-center gap-2 text-sm p-1 hover:bg-blue-100 rounded cursor-pointer">
                    <input type="checkbox" checked={reqProps.includes(s.id)} onChange={() => toggleProp(s.id, reqProps, setReqProps)} />
                    <div className={`w-3 h-3 rounded-full ${s.color || 'bg-gray-400'}`} />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded font-bold text-gray-600 hover:bg-gray-200">Cancel</button>
          <button 
            onClick={handlePropose} 
            disabled={offerMoney === 0 && offerCards === 0 && offerProps.length === 0 && reqMoney === 0 && reqCards === 0 && reqProps.length === 0}
            className="px-6 py-2 rounded font-bold bg-amber-600 text-white hover:bg-amber-700 disabled:bg-gray-400"
          >
            Propose Trade
          </button>
        </div>
      </div>
    </div>
  );
}

export function TradeReviewModal({ state, dispatch }: { state: GameState, dispatch: any }) {
  const offer = state.tradeOffer!;
  const fromPlayer = state.players.find(p => p.id === offer.fromPlayerId)!;
  const toPlayer = state.players.find(p => p.id === offer.toPlayerId)!;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-amber-900 w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="bg-amber-800 text-white p-4 text-center">
          <h2 className="text-2xl font-bold">Trade Proposal</h2>
          <p className="text-amber-200 text-sm">{fromPlayer.name} wants to trade with {toPlayer.name}</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-3 border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="font-bold text-green-800 border-b border-green-200 pb-2">{fromPlayer.name} Offers:</h3>
            
            {offer.offerMoney > 0 && (
              <div className="bg-white p-2 rounded border border-green-100 flex items-center gap-2 shadow-sm">
                <span className="text-xl">💰</span>
                <span className="font-mono font-bold text-green-700 text-lg">฿{offer.offerMoney}</span>
              </div>
            )}
            
            {offer.offerCards > 0 && (
              <div className="bg-white p-2 rounded border border-purple-100 flex items-center gap-2 shadow-sm">
                <span className="text-xl">🎫</span>
                <span className="font-bold text-purple-700">{offer.offerCards}x Get Out of Jail Free</span>
              </div>
            )}
            
            {offer.offerProperties.length > 0 && (
              <div className="bg-white p-2 rounded border border-blue-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Properties</span>
                {offer.offerProperties.map(id => {
                  const s = BOARD_SPACES[id];
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className={`w-3 h-3 rounded-full ${s.color || 'bg-gray-400'}`} />
                      {s.name}
                    </div>
                  );
                })}
              </div>
            )}
            
            {offer.offerMoney === 0 && offer.offerCards === 0 && offer.offerProperties.length === 0 && (
              <span className="text-sm text-gray-500 italic p-2">Nothing</span>
            )}
          </div>

          <div className="flex flex-col gap-3 border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="font-bold text-blue-800 border-b border-blue-200 pb-2">{fromPlayer.name} Wants:</h3>
            
            {offer.requestMoney > 0 && (
              <div className="bg-white p-2 rounded border border-green-100 flex items-center gap-2 shadow-sm">
                <span className="text-xl">💰</span>
                <span className="font-mono font-bold text-green-700 text-lg">฿{offer.requestMoney}</span>
              </div>
            )}
            
            {offer.requestCards > 0 && (
              <div className="bg-white p-2 rounded border border-purple-100 flex items-center gap-2 shadow-sm">
                <span className="text-xl">🎫</span>
                <span className="font-bold text-purple-700">{offer.requestCards}x Get Out of Jail Free</span>
              </div>
            )}
            
            {offer.requestProperties.length > 0 && (
              <div className="bg-white p-2 rounded border border-blue-100 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Properties</span>
                {offer.requestProperties.map(id => {
                  const s = BOARD_SPACES[id];
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <div className={`w-3 h-3 rounded-full ${s.color || 'bg-gray-400'}`} />
                      {s.name}
                    </div>
                  );
                })}
              </div>
            )}
            
            {offer.requestMoney === 0 && offer.requestCards === 0 && offer.requestProperties.length === 0 && (
              <span className="text-sm text-gray-500 italic p-2">Nothing</span>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={() => dispatch({ type: 'REJECT_TRADE' })} className="px-6 py-2 rounded font-bold bg-red-600 text-white hover:bg-red-700">Reject</button>
          <button onClick={() => dispatch({ type: 'ACCEPT_TRADE' })} className="px-6 py-2 rounded font-bold bg-green-600 text-white hover:bg-green-700">Accept Trade</button>
        </div>
      </div>
    </div>
  );
}
