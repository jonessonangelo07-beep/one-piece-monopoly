import React, { useState, useEffect } from 'react';
import { useMonopoly } from './game/useMonopoly';
import { Board } from './components/Board';
import { ActionPanel } from './components/ActionPanel';
import { PlayerStats } from './components/PlayerStats';
import { LogPanel } from './components/LogPanel';
import { TradeBuilderModal, TradeReviewModal } from './components/TradeModals';
import { AuctionModal } from './components/AuctionModal';
import { GameOverModal } from './components/GameOverModal';
import { PropertyModal } from './components/PropertyModal';
import { CardModal } from './components/CardModal';
import { SetupModal } from './components/SetupModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const { state, dispatch } = useMonopoly();
  const [isBuildingTrade, setIsBuildingTrade] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Bot Logic
  useEffect(() => {
    if (state.phase === 'SETUP' || state.phase === 'GAME_OVER' || state.isPaused) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    
    // Auto-reject trades for bots
    if (state.tradeOffer && state.tradeOffer.toPlayerId === currentPlayer?.id && currentPlayer?.isBot) {
      const timer = setTimeout(() => dispatch({ type: 'REJECT_TRADE' }), 1500);
      return () => clearTimeout(timer);
    }

    // Handle auction for bots
    if (state.phase === 'AUCTION' && state.auction) {
      const auction = state.auction;
      const bidderId = auction.activeBidders[auction.currentBidderIndex];
      const bidder = state.players.find(p => p.id === bidderId);
      
      if (bidder?.isBot) {
        const timer = setTimeout(() => {
          const isHighest = auction.highestBidderId === bidder.id;
          if (!isHighest && bidder.money > auction.currentBid + 10 && auction.currentBid < 400) {
            dispatch({ type: 'PLACE_BID', amount: auction.currentBid + 10 });
          } else {
            dispatch({ type: 'FOLD_AUCTION' });
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (!currentPlayer || !currentPlayer.isBot) return;

    const timer = setTimeout(() => {
      if (state.phase === 'ROLL') {
        if (currentPlayer.inJail) {
          if (currentPlayer.getOutOfJailFreeCards > 0) {
            dispatch({ type: 'USE_JAIL_CARD' });
          } else if (currentPlayer.money > 500) {
            dispatch({ type: 'PAY_JAIL_FINE' });
          } else {
            dispatch({ type: 'ROLL_JAIL_DICE' });
          }
        } else {
          dispatch({ type: 'ROLL_DICE' });
        }
      } else if (state.phase === 'ACTION') {
        if (state.pendingAction) {
          if (state.pendingAction.type === 'BUY_PROPERTY') {
            const space = state.pendingAction.space!;
            if (currentPlayer.money >= space.price! + 200) {
              dispatch({ type: 'BUY_PROPERTY' });
            } else {
              dispatch({ type: 'SKIP_BUY' });
            }
          } else if (state.pendingAction.type === 'PAY_RENT') {
            dispatch({ type: 'PAY_RENT' });
          } else if (state.pendingAction.type === 'PAY_TAX') {
            dispatch({ type: 'PAY_TAX' });
          } else if (state.pendingAction.type === 'CHANCE' || state.pendingAction.type === 'CHEST') {
            dispatch({ type: 'DRAW_CARD' });
          } else if (state.pendingAction.type === 'GO_TO_JAIL') {
            dispatch({ type: 'EXECUTE_GO_TO_JAIL' });
          } else if (state.pendingAction.type === 'BANKRUPT') {
            dispatch({ type: 'DECLARE_BANKRUPTCY' });
          }
        } else if (state.activeCard) {
          dispatch({ type: 'RESOLVE_CARD' });
        } else {
          // If in action phase but no pending action, end turn
          dispatch({ type: 'END_TURN' });
        }
      } else if (state.phase === 'END_TURN') {
        dispatch({ type: 'END_TURN' });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [state, dispatch]);

  if (state.phase === 'SETUP') {
    return (
      <SetupModal 
        onStart={(players) => dispatch({ type: 'START_GAME', players })} 
        onLoad={(savedState) => dispatch({ type: 'LOAD_GAME', state: savedState })}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-amber-900/10 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side: Board */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <Board players={state.players} properties={state.properties} onSpaceClick={setSelectedSpaceId} />
        </div>

        {/* Right Side: Controls & Stats */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-amber-800 text-amber-50 p-4 rounded-xl shadow-lg border-4 border-amber-950 flex justify-between items-center">
            <div className="text-left">
              <h1 className="text-3xl font-black tracking-wider">ONE PIECE</h1>
              <h2 className="text-xl font-bold text-amber-300">MONOPOLY</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsHelpOpen(true)}
                className="p-2 bg-amber-700 hover:bg-amber-600 rounded-lg border-2 border-amber-900 transition-colors"
                title="Help & Rules"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                className="p-2 bg-amber-700 hover:bg-amber-600 rounded-lg border-2 border-amber-900 transition-colors"
                title="Pause Game"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>

          <ActionPanel state={state} dispatch={dispatch} onOpenTrade={() => setIsBuildingTrade(true)} />
          <PlayerStats state={state} />
          <LogPanel log={state.log} />
        </div>

      </div>
      
      {isBuildingTrade && <TradeBuilderModal state={state} dispatch={dispatch} onClose={() => setIsBuildingTrade(false)} />}
      {state.tradeOffer && <TradeReviewModal state={state} dispatch={dispatch} />}
      {state.auction && <AuctionModal state={state} dispatch={dispatch} />}
      {state.phase === 'GAME_OVER' && <GameOverModal state={state} />}
      {selectedSpaceId !== null && <PropertyModal spaceId={selectedSpaceId} state={state} onClose={() => setSelectedSpaceId(null)} />}
      {state.activeCard && <CardModal state={state} dispatch={dispatch} />}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {state.isPaused && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-amber-100 p-8 rounded-2xl border-4 border-amber-900 shadow-2xl text-center max-w-md w-full mx-4">
            <h2 className="text-4xl font-black text-amber-900 mb-4 tracking-wider uppercase">Game Paused</h2>
            <p className="text-amber-800 mb-8 font-medium">Take a break, pirate! The sea will wait.</p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  localStorage.setItem('one_piece_monopoly_save', JSON.stringify(state));
                  alert('Game saved successfully!');
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl transition-colors shadow-lg border-2 border-blue-800"
              >
                Save Game
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-xl transition-colors shadow-lg border-2 border-green-800"
              >
                Resume Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
