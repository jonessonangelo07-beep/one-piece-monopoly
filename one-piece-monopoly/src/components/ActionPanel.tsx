import React, { useEffect } from 'react';
import { GameState, Player } from '../game/types';
import { BOARD_SPACES } from '../game/constants';
import { PlayerToken } from './PlayerToken';
import { ThematicDie } from './ThematicDie';

interface ActionPanelProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onOpenTrade: () => void;
}

export function ActionPanel({ state, dispatch, onOpenTrade }: ActionPanelProps) {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const ownedProperties = BOARD_SPACES.filter(s => state.properties[s.id]?.ownerId === currentPlayer.id);
  const isDouble = state.dice[0] === state.dice[1];

  useEffect(() => {
    if (state.pendingAction?.type === 'GO_TO_JAIL') {
      const timer = setTimeout(() => {
        dispatch({ type: 'EXECUTE_GO_TO_JAIL' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.pendingAction?.type, dispatch]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border-2 border-amber-800 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentPlayer.color} border-2 border-white shadow-sm text-white`}>
          <PlayerToken name={currentPlayer.name} className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {currentPlayer.name}'s Turn
        </h2>
      </div>

      <div className="flex gap-4 items-center justify-center py-2">
        <ThematicDie value={state.dice[0]} rollCount={state.rollCount} isDouble={isDouble} />
        <ThematicDie value={state.dice[1]} rollCount={state.rollCount} isDouble={isDouble} />
      </div>

      <div className="flex flex-col gap-2">
        {state.phase === 'ROLL' && !currentPlayer.inJail && currentPlayer.money >= 0 && (
          <button
            onClick={() => dispatch({ type: 'ROLL_DICE' })}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
          >
            Roll Dice
          </button>
        )}

        {state.phase === 'ROLL' && currentPlayer.inJail && (
          <>
            {currentPlayer.getOutOfJailFreeCards > 0 && (
              <button
                onClick={() => dispatch({ type: 'USE_JAIL_CARD' })}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                Use Jail Card
              </button>
            )}
            <button
              onClick={() => dispatch({ type: 'ROLL_JAIL_DICE' })}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              Roll for Doubles
            </button>
            <button
              onClick={() => dispatch({ type: 'PAY_JAIL_FINE' })}
              disabled={currentPlayer.money < 50}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
            >
              Pay ฿50 Fine
            </button>
          </>
        )}

        {state.phase === 'ACTION' && state.pendingAction && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm font-semibold text-gray-800 mb-3 text-center">
              {state.pendingAction.type === 'BUY_PROPERTY' && `Buy ${state.pendingAction.space?.name} for ฿${state.pendingAction.space?.price}?`}
              {state.pendingAction.type === 'PAY_RENT' && `Pay ฿${state.pendingAction.amount} rent for ${state.pendingAction.space?.name}.`}
              {state.pendingAction.type === 'PAY_TAX' && (state.pendingAction.message || `Pay ฿${state.pendingAction.amount} tax.`)}
              {(state.pendingAction.type === 'CHANCE' || state.pendingAction.type === 'CHEST') && `Draw a card!`}
            </p>
            
            <div className="flex gap-2">
              {state.pendingAction.type === 'BUY_PROPERTY' && (
                <>
                  <button
                    onClick={() => dispatch({ type: 'BUY_PROPERTY' })}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'SKIP_BUY' })}
                    className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Skip
                  </button>
                </>
              )}
              
              {state.pendingAction.type === 'PAY_RENT' && (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => dispatch({ type: 'PAY_RENT' })}
                    disabled={currentPlayer.money < (state.pendingAction.amount || 0)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
                  >
                    Pay Rent (฿{state.pendingAction.amount})
                  </button>
                  {currentPlayer.money < (state.pendingAction.amount || 0) && (
                    <button
                      onClick={() => dispatch({ type: 'DECLARE_BANKRUPTCY' })}
                      className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-colors"
                    >
                      Declare Bankruptcy
                    </button>
                  )}
                </div>
              )}

              {state.pendingAction.type === 'PAY_TAX' && (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={() => dispatch({ type: 'PAY_TAX' })}
                    disabled={currentPlayer.money < (state.pendingAction.amount || 0)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
                  >
                    Pay Tax (฿{state.pendingAction.amount})
                  </button>
                  {currentPlayer.money < (state.pendingAction.amount || 0) && (
                    <button
                      onClick={() => dispatch({ type: 'DECLARE_BANKRUPTCY' })}
                      className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-colors"
                    >
                      Declare Bankruptcy
                    </button>
                  )}
                </div>
              )}

              {(state.pendingAction.type === 'CHANCE' || state.pendingAction.type === 'CHEST') && (
                <button
                  onClick={() => dispatch({ type: 'DRAW_CARD' })}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                >
                  Draw Card
                </button>
              )}

              {state.pendingAction.type === 'GO_TO_JAIL' && (
                <div className="flex flex-col items-center justify-center p-4 bg-red-50 border-2 border-red-500 rounded-lg animate-pulse w-full">
                  <h3 className="text-xl font-bold text-red-600 mb-2">Captured by Marines!</h3>
                  <p className="text-red-800 font-semibold">Transporting to Impel Down...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {state.phase === 'END_TURN' && currentPlayer.money >= 0 && (
          <button
            onClick={() => dispatch({ type: 'END_TURN' })}
            className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors"
          >
            End Turn
          </button>
        )}

        {currentPlayer.money < 0 && !state.pendingAction && (
          <div className="p-3 bg-red-50 rounded-lg border border-red-200 flex flex-col gap-2">
            <p className="text-sm font-bold text-red-800 text-center">
              You are in debt! Raise funds or declare bankruptcy.
            </p>
            <button
              onClick={() => dispatch({ type: 'DECLARE_BANKRUPTCY' })}
              className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-colors"
            >
              Declare Bankruptcy
            </button>
          </div>
        )}

        {(state.phase === 'ROLL' || state.phase === 'END_TURN' || state.phase === 'ACTION') && (
          <button
            onClick={onOpenTrade}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
          >
            Trade
          </button>
        )}
      </div>

      {ownedProperties.length > 0 && (
        <div className="mt-2 border-t border-gray-200 pt-4">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">Manage Properties</h3>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
            {ownedProperties.map(space => {
              const propState = state.properties[space.id];
              const groupSpaces = BOARD_SPACES.filter(s => s.group === space.group);
              const hasMonopoly = groupSpaces.every(s => state.properties[s.id]?.ownerId === currentPlayer.id);
              const anyMortgaged = groupSpaces.some(s => state.properties[s.id]?.mortgaged);
              const canBuild = space.type === 'property' && hasMonopoly && !anyMortgaged && groupSpaces.every(s => state.properties[s.id].houses >= propState.houses) && propState.houses < 5;
              const mortgageValue = Math.floor(space.price! / 2);
              const unmortgageCost = Math.ceil(mortgageValue * 1.1);

              return (
                <div key={space.id} className="flex flex-col gap-1 p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${space.color || 'bg-gray-400'}`} />
                      <span className={`font-semibold ${propState.mortgaged ? 'line-through text-gray-400' : ''}`}>{space.name}</span>
                      {space.type === 'property' && (
                        <span className="text-gray-500">
                          ({propState.houses === 5 ? 'Hotel' : `${propState.houses} H`})
                        </span>
                      )}
                    </div>
                    {!propState.mortgaged && space.type === 'property' && (
                      <span className="text-gray-600 font-medium">
                        Rent: ฿{propState.houses === 0 ? (hasMonopoly ? space.rent![0] * 2 : space.rent![0]) : space.rent![propState.houses]}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 justify-end mt-1 text-[0.65rem]">
                    {canBuild && (
                      <button 
                        onClick={() => dispatch({ type: 'BUY_HOUSE', spaceId: space.id })}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPlayer.money < space.houseCost!}
                      >
                        {propState.houses === 4 ? `Build Hotel (฿${space.houseCost})` : `Build House (฿${space.houseCost})`}
                      </button>
                    )}
                    {!propState.mortgaged && propState.houses === 0 && (
                      <button 
                        onClick={() => dispatch({ type: 'MORTGAGE_PROPERTY', spaceId: space.id })}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Mortgage (+฿{mortgageValue})
                      </button>
                    )}
                    {propState.mortgaged && (
                      <button 
                        onClick={() => dispatch({ type: 'UNMORTGAGE_PROPERTY', spaceId: space.id })}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        disabled={currentPlayer.money < unmortgageCost}
                      >
                        Unmortgage (฿{unmortgageCost})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
