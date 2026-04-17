import { useReducer } from 'react';
import { GameState, Player, PropertyState, PendingAction, GamePhase } from './types';
import { BOARD_SPACES } from './constants';
import { CHANCE_CARDS, COMMUNITY_CHEST_CARDS, shuffleDeck } from './cards';

type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'END_TURN' }
  | { type: 'BUY_PROPERTY' }
  | { type: 'SKIP_BUY' }
  | { type: 'PAY_RENT' }
  | { type: 'PAY_TAX' }
  | { type: 'DRAW_CARD' }
  | { type: 'RESOLVE_CARD' }
  | { type: 'PAY_JAIL_FINE' }
  | { type: 'ROLL_JAIL_DICE' }
  | { type: 'DECLARE_BANKRUPTCY' }
  | { type: 'BUY_HOUSE'; spaceId: number }
  | { type: 'MORTGAGE_PROPERTY'; spaceId: number }
  | { type: 'UNMORTGAGE_PROPERTY'; spaceId: number }
  | { type: 'PROPOSE_TRADE'; offer: any }
  | { type: 'ACCEPT_TRADE' }
  | { type: 'REJECT_TRADE' }
  | { type: 'CANCEL_TRADE' }
  | { type: 'USE_JAIL_CARD' }
  | { type: 'PLACE_BID'; amount: number }
  | { type: 'FOLD_AUCTION' }
  | { type: 'EXECUTE_GO_TO_JAIL' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'LOAD_GAME'; state: GameState };

export const INITIAL_MONEY = 1500;

export const DEFAULT_PLAYERS: Player[] = [
  { id: 0, name: 'Luffy', color: 'bg-rose-600', borderColor: 'border-rose-600', textColor: 'text-rose-600', icon: '👒', money: INITIAL_MONEY, position: 0, inJail: false, jailTurns: 0, bankrupt: false, getOutOfJailFreeCards: 0, isBot: false },
  { id: 1, name: 'Zoro', color: 'bg-emerald-500', borderColor: 'border-emerald-500', textColor: 'text-emerald-500', icon: '⚔️', money: INITIAL_MONEY, position: 0, inJail: false, jailTurns: 0, bankrupt: false, getOutOfJailFreeCards: 0, isBot: false },
  { id: 2, name: 'Nami', color: 'bg-amber-500', borderColor: 'border-amber-500', textColor: 'text-amber-500', icon: '🍊', money: INITIAL_MONEY, position: 0, inJail: false, jailTurns: 0, bankrupt: false, getOutOfJailFreeCards: 0, isBot: false },
  { id: 3, name: 'Sanji', color: 'bg-cyan-500', borderColor: 'border-cyan-500', textColor: 'text-cyan-500', icon: '🍴', money: INITIAL_MONEY, position: 0, inJail: false, jailTurns: 0, bankrupt: false, getOutOfJailFreeCards: 0, isBot: false },
];

const initialProperties: Record<number, PropertyState> = {};
BOARD_SPACES.forEach(space => {
  if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
    initialProperties[space.id] = { spaceId: space.id, ownerId: null, houses: 0, mortgaged: false };
  }
});

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  properties: initialProperties,
  phase: 'SETUP',
  dice: [1, 1],
  rollCount: 0,
  doublesCount: 0,
  log: ['Welcome to One Piece Monopoly!'],
  pendingAction: null,
  tradeOffer: null,
  auction: null,
  isPaused: false,
  chanceDeck: shuffleDeck(CHANCE_CARDS),
  chestDeck: shuffleDeck(COMMUNITY_CHEST_CARDS),
  activeCard: null,
};

function calculateRent(spaceId: number, diceTotal: number, state: GameState): number {
  const space = BOARD_SPACES[spaceId];
  const propState = state.properties[spaceId];
  if (!propState || propState.ownerId === null) return 0;

  if (space.type === 'property') {
    // Check for monopoly (all properties of same color owned by same player)
    const sameColorSpaces = BOARD_SPACES.filter(s => s.group === space.group);
    const hasMonopoly = sameColorSpaces.every(s => state.properties[s.id]?.ownerId === propState.ownerId);
    
    if (propState.houses === 0) {
      return hasMonopoly ? (space.rent![0] * 2) : space.rent![0];
    }
    return space.rent![propState.houses];
  }
  
  if (space.type === 'railroad') {
    const ownedRailroads = BOARD_SPACES.filter(s => s.type === 'railroad' && state.properties[s.id]?.ownerId === propState.ownerId).length;
    return space.rent![ownedRailroads - 1];
  }

  if (space.type === 'utility') {
    const ownedUtilities = BOARD_SPACES.filter(s => s.type === 'utility' && state.properties[s.id]?.ownerId === propState.ownerId).length;
    return ownedUtilities === 2 ? diceTotal * 10 : diceTotal * 4;
  }

  return 0;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'LOAD_GAME') {
    return {
      ...action.state,
      isPaused: false,
      log: [...action.state.log, 'Game loaded successfully!'],
    };
  }

  if (action.type === 'START_GAME') {
    return {
      ...state,
      players: action.players,
      phase: 'ROLL',
      log: ['Game started! Set sail!'],
    };
  }

  if (action.type === 'TOGGLE_PAUSE') {
    return { ...state, isPaused: !state.isPaused };
  }

  if (state.isPaused) return state;

  const currentPlayer = state.players[state.currentPlayerIndex];

  switch (action.type) {
    case 'ROLL_DICE': {
      if (state.phase !== 'ROLL' || currentPlayer.inJail) return state;

      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const isDouble = d1 === d2;
      const total = d1 + d2;

      let newDoublesCount = isDouble ? state.doublesCount + 1 : 0;
      let newLog = [...state.log, `${currentPlayer.name} rolled ${d1} and ${d2} (${total}).`];

      if (newDoublesCount === 3) {
        newLog.push(`${currentPlayer.name} rolled doubles 3 times! Captured by Marines!`);
        return {
          ...state,
          dice: [d1, d2],
          rollCount: state.rollCount + 1,
          doublesCount: 0,
          phase: 'ACTION',
          pendingAction: { type: 'GO_TO_JAIL' },
          log: newLog,
        };
      }

      let newPosition = (currentPlayer.position + total) % 40;
      let newMoney = currentPlayer.money;
      if (newPosition < currentPlayer.position) {
        newMoney += 200;
        newLog.push(`${currentPlayer.name} passed SET SAIL! Collected ฿200.`);
      }

      const space = BOARD_SPACES[newPosition];
      newLog.push(`${currentPlayer.name} landed on ${space.name}.`);

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex] = { ...currentPlayer, position: newPosition, money: newMoney };

      let nextPhase: GamePhase = isDouble ? 'ROLL' : 'END_TURN';
      let pendingAction: PendingAction | null = null;

      // Resolve space
      if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
        const propState = state.properties[space.id];
        if (propState.ownerId === null) {
          nextPhase = 'ACTION';
          pendingAction = { type: 'BUY_PROPERTY', space };
        } else if (propState.ownerId !== currentPlayer.id && !propState.mortgaged) {
          const rent = calculateRent(space.id, total, state);
          nextPhase = 'ACTION';
          pendingAction = { type: 'PAY_RENT', space, amount: rent, ownerId: propState.ownerId };
        }
      } else if (space.type === 'tax') {
        nextPhase = 'ACTION';
        pendingAction = { type: 'PAY_TAX', space, amount: space.price };
      } else if (space.type === 'gotojail') {
        nextPhase = 'ACTION';
        pendingAction = { type: 'GO_TO_JAIL' };
        newLog.push(`${currentPlayer.name} landed on Captured by Marines!`);
      } else if (space.type === 'chance' || space.type === 'chest') {
        nextPhase = 'ACTION';
        pendingAction = { type: space.type === 'chance' ? 'CHANCE' : 'CHEST', space };
      }

      return {
        ...state,
        players: newPlayers,
        dice: [d1, d2],
        rollCount: state.rollCount + 1,
        doublesCount: newDoublesCount,
        phase: pendingAction ? 'ACTION' : nextPhase,
        pendingAction,
        log: newLog,
      };
    }

    case 'EXECUTE_GO_TO_JAIL': {
      if (state.pendingAction?.type !== 'GO_TO_JAIL') return state;
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].position = 10;
      newPlayers[state.currentPlayerIndex].inJail = true;
      newPlayers[state.currentPlayerIndex].jailTurns = 0;

      return {
        ...state,
        players: newPlayers,
        phase: 'END_TURN',
        pendingAction: null,
        doublesCount: 0,
        log: [...state.log, `${state.players[state.currentPlayerIndex].name} was sent to Impel Down!`],
      };
    }

    case 'BUY_PROPERTY': {
      if (!state.pendingAction || state.pendingAction.type !== 'BUY_PROPERTY') return state;
      const space = state.pendingAction.space!;
      if (currentPlayer.money < space.price!) {
        return { ...state, log: [...state.log, `${currentPlayer.name} cannot afford ${space.name}.`] };
      }

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= space.price!;
      
      const newProperties = { ...state.properties };
      newProperties[space.id] = { ...newProperties[space.id], ownerId: currentPlayer.id };

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        phase: state.doublesCount > 0 ? 'ROLL' : 'END_TURN',
        pendingAction: null,
        log: [...state.log, `${currentPlayer.name} bought ${space.name} for ฿${space.price}.`],
      };
    }

    case 'SKIP_BUY': {
      const space = state.pendingAction?.space;
      if (!space) return state;
      
      const activeBidders = state.players.filter(p => !p.bankrupt).map(p => p.id);
      
      return {
        ...state,
        phase: 'AUCTION',
        pendingAction: null,
        auction: {
          spaceId: space.id,
          currentBid: 0,
          highestBidderId: null,
          activeBidders,
          currentBidderIndex: 0,
        },
        log: [...state.log, `${currentPlayer.name} skipped buying ${space.name}. Auction started!`],
      };
    }

    case 'PAY_RENT': {
      if (!state.pendingAction || state.pendingAction.type !== 'PAY_RENT') return state;
      const { amount, ownerId, space } = state.pendingAction;
      
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= amount!;
      const ownerIndex = newPlayers.findIndex(p => p.id === ownerId);
      if (ownerIndex !== -1) {
        newPlayers[ownerIndex].money += amount!;
      }

      const ownerName = newPlayers[ownerIndex].name;
      return {
        ...state,
        players: newPlayers,
        phase: state.doublesCount > 0 ? 'ROLL' : 'END_TURN',
        pendingAction: null,
        log: [...state.log, `${currentPlayer.name} paid ฿${amount} rent to ${ownerName} for ${space?.name}.`],
      };
    }

    case 'PAY_TAX': {
      if (!state.pendingAction || state.pendingAction.type !== 'PAY_TAX') return state;
      const { amount, space } = state.pendingAction;
      
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= amount!;

      return {
        ...state,
        players: newPlayers,
        phase: state.doublesCount > 0 ? 'ROLL' : 'END_TURN',
        pendingAction: null,
        log: [...state.log, `${currentPlayer.name} paid ฿${amount}${space ? ` for ${space.name}` : ''}.`],
      };
    }

    case 'DECLARE_BANKRUPTCY': {
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].bankrupt = true;
      
      const newProperties = { ...state.properties };
      let logMsg = `${currentPlayer.name} declared bankruptcy!`;

      if (state.pendingAction?.type === 'PAY_RENT' && state.pendingAction.ownerId !== undefined) {
        const creditorId = state.pendingAction.ownerId;
        const creditor = newPlayers.find(p => p.id === creditorId);
        if (creditor) {
          creditor.money += currentPlayer.money;
          newPlayers[state.currentPlayerIndex].money = 0;
          Object.values(newProperties).forEach(prop => {
            if (prop.ownerId === currentPlayer.id) {
              prop.ownerId = creditorId;
              prop.houses = 0; 
            }
          });
          logMsg += ` All assets transferred to ${creditor.name}.`;
        }
      } else {
        newPlayers[state.currentPlayerIndex].money = 0;
        Object.values(newProperties).forEach(prop => {
          if (prop.ownerId === currentPlayer.id) {
            prop.ownerId = null;
            prop.houses = 0;
            prop.mortgaged = false;
          }
        });
        logMsg += ` All properties returned to the bank.`;
      }

      const activePlayers = newPlayers.filter(p => !p.bankrupt);
      if (activePlayers.length === 1) {
        return {
          ...state,
          players: newPlayers,
          properties: newProperties,
          phase: 'GAME_OVER',
          pendingAction: null,
          log: [...state.log, logMsg, `${activePlayers[0].name} WINS THE GAME!`]
        };
      }

      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      while (newPlayers[nextIndex].bankrupt) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        currentPlayerIndex: nextIndex,
        phase: 'ROLL',
        doublesCount: 0,
        pendingAction: null,
        log: [...state.log, logMsg]
      };
    }

    case 'DRAW_CARD': {
      if (!state.pendingAction || (state.pendingAction.type !== 'CHANCE' && state.pendingAction.type !== 'CHEST')) return state;
      
      const isChance = state.pendingAction.type === 'CHANCE';
      let deck = isChance ? [...state.chanceDeck] : [...state.chestDeck];
      
      if (deck.length === 0) {
        deck = shuffleDeck(isChance ? CHANCE_CARDS : COMMUNITY_CHEST_CARDS);
      }
      
      const card = deck.pop()!;
      
      return {
        ...state,
        chanceDeck: isChance ? deck : state.chanceDeck,
        chestDeck: !isChance ? deck : state.chestDeck,
        activeCard: { type: isChance ? 'chance' : 'chest', card },
      };
    }

    case 'RESOLVE_CARD': {
      if (!state.activeCard) return state;
      
      const { card, type } = state.activeCard;
      const newPlayers = [...state.players];
      let newLog = [...state.log, `${currentPlayer.name} drew a card: "${card.text}"`];
      let nextPhase: GamePhase = state.doublesCount > 0 ? 'ROLL' : 'END_TURN';
      let newPendingAction: PendingAction | null = null;
      let newProperties = { ...state.properties };

      switch (card.actionType) {
        case 'advance_to': {
          let newPosition = card.value!;
          if (newPosition < currentPlayer.position && newPosition !== 10) { // 10 is jail, don't collect 200 if going to jail
            newPlayers[state.currentPlayerIndex].money += 200;
            newLog.push(`${currentPlayer.name} passed SET SAIL! Collected ฿200.`);
          }
          newPlayers[state.currentPlayerIndex].position = newPosition;
          
          const space = BOARD_SPACES[newPosition];
          newLog.push(`${currentPlayer.name} advanced to ${space.name}.`);
          
          if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
            const propState = state.properties[space.id];
            if (propState.ownerId === null) {
              nextPhase = 'ACTION';
              newPendingAction = { type: 'BUY_PROPERTY', space };
            } else if (propState.ownerId !== currentPlayer.id && !propState.mortgaged) {
              const rent = calculateRent(space.id, state.dice[0] + state.dice[1], state);
              nextPhase = 'ACTION';
              newPendingAction = { type: 'PAY_RENT', space, amount: rent, ownerId: propState.ownerId };
            }
          }
          break;
        }
        case 'advance_to_nearest': {
          let newPosition = currentPlayer.position;
          while (BOARD_SPACES[newPosition].type !== card.target) {
            newPosition = (newPosition + 1) % 40;
          }
          if (newPosition < currentPlayer.position) {
            newPlayers[state.currentPlayerIndex].money += 200;
            newLog.push(`${currentPlayer.name} passed SET SAIL! Collected ฿200.`);
          }
          newPlayers[state.currentPlayerIndex].position = newPosition;
          
          const space = BOARD_SPACES[newPosition];
          newLog.push(`${currentPlayer.name} advanced to ${space.name}.`);
          
          const propState = state.properties[space.id];
          if (propState.ownerId === null) {
            nextPhase = 'ACTION';
            newPendingAction = { type: 'BUY_PROPERTY', space };
          } else if (propState.ownerId !== currentPlayer.id && !propState.mortgaged) {
            // Special rent rules for these cards
            let rent = 0;
            if (card.target === 'utility') {
              // Roll dice and pay 10x
              const d1 = Math.floor(Math.random() * 6) + 1;
              const d2 = Math.floor(Math.random() * 6) + 1;
              rent = (d1 + d2) * 10;
              newLog.push(`Rolled ${d1} and ${d2} for utility rent.`);
            } else if (card.target === 'railroad') {
              // Pay double normal rent
              rent = calculateRent(space.id, state.dice[0] + state.dice[1], state) * 2;
            }
            
            nextPhase = 'ACTION';
            newPendingAction = { type: 'PAY_RENT', space, amount: rent, ownerId: propState.ownerId };
          }
          break;
        }
        case 'collect': {
          newPlayers[state.currentPlayerIndex].money += card.value!;
          break;
        }
        case 'pay': {
          nextPhase = 'ACTION';
          newPendingAction = { type: 'PAY_TAX', amount: card.value!, message: card.text };
          break;
        }
        case 'pay_per_building': {
          let totalHouses = 0;
          let totalHotels = 0;
          Object.values(state.properties).forEach(p => {
            if (p.ownerId === currentPlayer.id) {
              if (p.houses === 5) totalHotels++;
              else totalHouses += p.houses;
            }
          });
          const amount = (totalHouses * card.houseCost!) + (totalHotels * card.hotelCost!);
          if (amount > 0) {
            nextPhase = 'ACTION';
            newPendingAction = { type: 'PAY_TAX', amount, message: card.text };
          } else {
            newLog.push(`${currentPlayer.name} has no buildings, pays nothing.`);
          }
          break;
        }
        case 'collect_from_all': {
          let collected = 0;
          newPlayers.forEach((p, i) => {
            if (i !== state.currentPlayerIndex && !p.bankrupt) {
              const amountToPay = Math.min(p.money, card.value!);
              newPlayers[i].money -= amountToPay;
              collected += amountToPay;
            }
          });
          newPlayers[state.currentPlayerIndex].money += collected;
          break;
        }
        case 'pay_to_all': {
          let paid = 0;
          newPlayers.forEach((p, i) => {
            if (i !== state.currentPlayerIndex && !p.bankrupt) {
              newPlayers[i].money += card.value!;
              paid += card.value!;
            }
          });
          newPlayers[state.currentPlayerIndex].money -= paid;
          break;
        }
        case 'go_to_jail': {
          newPlayers[state.currentPlayerIndex].position = 10;
          newPlayers[state.currentPlayerIndex].inJail = true;
          newPlayers[state.currentPlayerIndex].jailTurns = 0;
          nextPhase = 'END_TURN';
          break;
        }
        case 'get_out_of_jail_free': {
          newPlayers[state.currentPlayerIndex].getOutOfJailFreeCards += 1;
          break;
        }
        case 'move_back': {
          let newPosition = currentPlayer.position - card.value!;
          if (newPosition < 0) newPosition += 40;
          newPlayers[state.currentPlayerIndex].position = newPosition;
          
          const space = BOARD_SPACES[newPosition];
          newLog.push(`${currentPlayer.name} moved back to ${space.name}.`);
          
          if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
            const propState = state.properties[space.id];
            if (propState.ownerId === null) {
              nextPhase = 'ACTION';
              newPendingAction = { type: 'BUY_PROPERTY', space };
            } else if (propState.ownerId !== currentPlayer.id && !propState.mortgaged) {
              const rent = calculateRent(space.id, state.dice[0] + state.dice[1], state);
              nextPhase = 'ACTION';
              newPendingAction = { type: 'PAY_RENT', space, amount: rent, ownerId: propState.ownerId };
            }
          } else if (space.type === 'tax') {
            nextPhase = 'ACTION';
            newPendingAction = { type: 'PAY_TAX', space, amount: space.price };
          }
          break;
        }
      }

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        phase: newPendingAction ? 'ACTION' : nextPhase,
        pendingAction: newPendingAction,
        activeCard: null,
        log: newLog,
      };
    }

    case 'PAY_JAIL_FINE': {
      if (!currentPlayer.inJail) return state;
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= 50;
      newPlayers[state.currentPlayerIndex].inJail = false;
      newPlayers[state.currentPlayerIndex].jailTurns = 0;

      return {
        ...state,
        players: newPlayers,
        phase: 'ROLL',
        log: [...state.log, `${currentPlayer.name} paid ฿50 to escape Impel Down.`],
      };
    }

    case 'ROLL_JAIL_DICE': {
      if (!currentPlayer.inJail) return state;
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const isDouble = d1 === d2;

      const newPlayers = [...state.players];
      let newLog = [...state.log, `${currentPlayer.name} rolled ${d1} and ${d2}.`];

      if (isDouble) {
        newPlayers[state.currentPlayerIndex].inJail = false;
        newPlayers[state.currentPlayerIndex].jailTurns = 0;
        newLog.push(`${currentPlayer.name} rolled doubles and escaped Impel Down!`);
        
        // Move player and resolve space
        const newPosition = (currentPlayer.position + d1 + d2) % 40;
        newPlayers[state.currentPlayerIndex].position = newPosition;
        
        const space = BOARD_SPACES[newPosition];
        newLog.push(`${currentPlayer.name} landed on ${space.name}.`);

        let nextPhase: GamePhase = 'END_TURN';
        let pendingAction: PendingAction | null = null;

        if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
          const propState = state.properties[space.id];
          if (propState.ownerId === null) {
            nextPhase = 'ACTION';
            pendingAction = { type: 'BUY_PROPERTY', space };
          } else if (propState.ownerId !== currentPlayer.id && !propState.mortgaged) {
            const rent = calculateRent(space.id, d1 + d2, state);
            nextPhase = 'ACTION';
            pendingAction = { type: 'PAY_RENT', space, amount: rent, ownerId: propState.ownerId };
          }
        } else if (space.type === 'tax') {
          nextPhase = 'ACTION';
          pendingAction = { type: 'PAY_TAX', space, amount: space.price };
        } else if (space.type === 'gotojail') {
          nextPhase = 'ACTION';
          pendingAction = { type: 'GO_TO_JAIL' };
          newLog.push(`${currentPlayer.name} landed on Captured by Marines!`);
        } else if (space.type === 'chance' || space.type === 'chest') {
          nextPhase = 'ACTION';
          pendingAction = { type: space.type === 'chance' ? 'CHANCE' : 'CHEST', space };
        }

        return {
          ...state,
          players: newPlayers,
          dice: [d1, d2],
          rollCount: state.rollCount + 1,
          phase: pendingAction ? 'ACTION' : nextPhase,
          pendingAction,
          log: newLog,
        };
      } else {
        newPlayers[state.currentPlayerIndex].jailTurns += 1;
        if (newPlayers[state.currentPlayerIndex].jailTurns >= 3) {
          newPlayers[state.currentPlayerIndex].money -= 50;
          newPlayers[state.currentPlayerIndex].inJail = false;
          newPlayers[state.currentPlayerIndex].jailTurns = 0;
          newLog.push(`${currentPlayer.name} served 3 turns and paid ฿50 to escape.`);
        } else {
          newLog.push(`${currentPlayer.name} remains in Impel Down.`);
        }
        return {
          ...state,
          players: newPlayers,
          dice: [d1, d2],
          rollCount: state.rollCount + 1,
          phase: 'END_TURN',
          log: newLog,
        };
      }
    }

    case 'END_TURN': {
      let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      // Skip bankrupt players
      while (state.players[nextIndex].bankrupt) {
        nextIndex = (nextIndex + 1) % state.players.length;
      }
      
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        phase: 'ROLL',
        doublesCount: 0,
        pendingAction: null,
      };
    }

    case 'BUY_HOUSE': {
      const { spaceId } = action;
      const space = BOARD_SPACES[spaceId];
      const propState = state.properties[spaceId];

      if (!space || space.type !== 'property' || !propState) return state;
      if (propState.ownerId !== currentPlayer.id) return state;
      if (propState.houses >= 5) return state;
      if (propState.mortgaged) return state;
      if (currentPlayer.money < space.houseCost!) {
        return { ...state, log: [...state.log, `${currentPlayer.name} cannot afford a house on ${space.name}.`] };
      }

      // Check monopoly and mortgages
      const groupSpaces = BOARD_SPACES.filter(s => s.group === space.group);
      const hasMonopoly = groupSpaces.every(s => state.properties[s.id]?.ownerId === currentPlayer.id);
      if (!hasMonopoly) {
        return { ...state, log: [...state.log, `${currentPlayer.name} needs a monopoly to build on ${space.name}.`] };
      }
      const anyMortgaged = groupSpaces.some(s => state.properties[s.id]?.mortgaged);
      if (anyMortgaged) {
        return { ...state, log: [...state.log, `Cannot build on ${space.name} because a property in the group is mortgaged.`] };
      }

      // Check even build
      const canBuild = groupSpaces.every(s => state.properties[s.id].houses >= propState.houses);
      if (!canBuild) {
        return { ...state, log: [...state.log, `Must build evenly on ${space.group} properties.`] };
      }

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= space.houseCost!;

      const newProperties = { ...state.properties };
      newProperties[spaceId] = { ...propState, houses: propState.houses + 1 };

      const buildType = propState.houses === 4 ? 'hotel' : 'house';

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        log: [...state.log, `${currentPlayer.name} built a ${buildType} on ${space.name} for ฿${space.houseCost}.`],
      };
    }

    case 'MORTGAGE_PROPERTY': {
      const { spaceId } = action;
      const space = BOARD_SPACES[spaceId];
      const propState = state.properties[spaceId];

      if (!space || !propState) return state;
      if (propState.ownerId !== currentPlayer.id) return state;
      if (propState.houses > 0) {
        return { ...state, log: [...state.log, `Cannot mortgage ${space.name} while it has houses.`] };
      }
      if (propState.mortgaged) return state;

      const mortgageValue = Math.floor(space.price! / 2);
      
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money += mortgageValue;

      const newProperties = { ...state.properties };
      newProperties[spaceId] = { ...propState, mortgaged: true };

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        log: [...state.log, `${currentPlayer.name} mortgaged ${space.name} for ฿${mortgageValue}.`],
      };
    }

    case 'UNMORTGAGE_PROPERTY': {
      const { spaceId } = action;
      const space = BOARD_SPACES[spaceId];
      const propState = state.properties[spaceId];

      if (!space || !propState) return state;
      if (propState.ownerId !== currentPlayer.id) return state;
      if (!propState.mortgaged) return state;

      const unmortgageCost = Math.ceil((space.price! / 2) * 1.1);
      
      if (currentPlayer.money < unmortgageCost) {
        return { ...state, log: [...state.log, `${currentPlayer.name} cannot afford to unmortgage ${space.name}.`] };
      }

      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].money -= unmortgageCost;

      const newProperties = { ...state.properties };
      newProperties[spaceId] = { ...propState, mortgaged: false };

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        log: [...state.log, `${currentPlayer.name} unmortgaged ${space.name} for ฿${unmortgageCost}.`],
      };
    }

    case 'PROPOSE_TRADE': {
      const { offer } = action;
      const toPlayer = state.players.find(p => p.id === offer.toPlayerId);
      return {
        ...state,
        tradeOffer: offer,
        log: [...state.log, `${currentPlayer.name} proposed a trade to ${toPlayer?.name}.`]
      };
    }

    case 'ACCEPT_TRADE': {
      if (!state.tradeOffer) return state;
      const { fromPlayerId, toPlayerId, offerMoney, offerProperties, offerCards, requestMoney, requestProperties, requestCards } = state.tradeOffer;
      
      const newPlayers = [...state.players];
      const fromIdx = newPlayers.findIndex(p => p.id === fromPlayerId);
      const toIdx = newPlayers.findIndex(p => p.id === toPlayerId);
      
      if (newPlayers[toIdx].money < requestMoney) {
        return {
          ...state,
          tradeOffer: null,
          log: [...state.log, `${newPlayers[toIdx].name} cannot afford to accept the trade. Trade cancelled.`]
        };
      }

      if (newPlayers[fromIdx].money < offerMoney) {
        return {
          ...state,
          tradeOffer: null,
          log: [...state.log, `${newPlayers[fromIdx].name} no longer has the funds to offer. Trade cancelled.`]
        };
      }
      
      newPlayers[fromIdx].money = newPlayers[fromIdx].money - offerMoney + requestMoney;
      newPlayers[toIdx].money = newPlayers[toIdx].money - requestMoney + offerMoney;
      
      newPlayers[fromIdx].getOutOfJailFreeCards = newPlayers[fromIdx].getOutOfJailFreeCards - offerCards + requestCards;
      newPlayers[toIdx].getOutOfJailFreeCards = newPlayers[toIdx].getOutOfJailFreeCards - requestCards + offerCards;

      const newProperties = { ...state.properties };
      offerProperties.forEach(id => newProperties[id] = { ...newProperties[id], ownerId: toPlayerId });
      requestProperties.forEach(id => newProperties[id] = { ...newProperties[id], ownerId: fromPlayerId });

      return {
        ...state,
        players: newPlayers,
        properties: newProperties,
        tradeOffer: null,
        log: [...state.log, `${newPlayers[toIdx].name} accepted the trade from ${newPlayers[fromIdx].name}.`]
      };
    }

    case 'REJECT_TRADE': {
      if (!state.tradeOffer) return state;
      const toName = state.players.find(p => p.id === state.tradeOffer!.toPlayerId)?.name;
      return { ...state, tradeOffer: null, log: [...state.log, `${toName} rejected the trade.`] };
    }

    case 'CANCEL_TRADE': {
      return { ...state, tradeOffer: null, log: [...state.log, `${currentPlayer.name} cancelled the trade proposal.`] };
    }

    case 'USE_JAIL_CARD': {
      if (!currentPlayer.inJail || currentPlayer.getOutOfJailFreeCards <= 0) return state;
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].inJail = false;
      newPlayers[state.currentPlayerIndex].jailTurns = 0;
      newPlayers[state.currentPlayerIndex].getOutOfJailFreeCards -= 1;
      return {
        ...state,
        players: newPlayers,
        phase: 'ROLL',
        log: [...state.log, `${currentPlayer.name} used a Get Out of Impel Down Free card!`]
      };
    }

    case 'PLACE_BID': {
      if (!state.auction) return state;
      const { amount } = action;
      const bidderId = state.auction.activeBidders[state.auction.currentBidderIndex];
      const bidder = state.players.find(p => p.id === bidderId)!;

      if (amount <= state.auction.currentBid || amount > bidder.money) return state;

      const nextIndex = (state.auction.currentBidderIndex + 1) % state.auction.activeBidders.length;

      return {
        ...state,
        auction: {
          ...state.auction,
          currentBid: amount,
          highestBidderId: bidderId,
          currentBidderIndex: nextIndex,
        },
        log: [...state.log, `${bidder.name} bid ฿${amount}.`],
      };
    }

    case 'FOLD_AUCTION': {
      if (!state.auction) return state;
      
      const foldingPlayerId = state.auction.activeBidders[state.auction.currentBidderIndex];
      const foldingPlayer = state.players.find(p => p.id === foldingPlayerId)!;
      
      const newBidders = state.auction.activeBidders.filter((_, i) => i !== state.auction!.currentBidderIndex);
      
      let newLog = [...state.log, `${foldingPlayer.name} folded from the auction.`];

      if (newBidders.length === 1 && state.auction.highestBidderId !== null) {
        const winnerId = newBidders[0];
        const winner = state.players.find(p => p.id === winnerId)!;
        const space = BOARD_SPACES[state.auction.spaceId];
        
        const newPlayers = [...state.players];
        const winnerIdx = newPlayers.findIndex(p => p.id === winnerId);
        newPlayers[winnerIdx].money -= state.auction.currentBid;

        const newProperties = { ...state.properties };
        newProperties[space.id] = { ...newProperties[space.id], ownerId: winnerId };

        newLog.push(`${winner.name} won the auction for ${space.name} with a bid of ฿${state.auction.currentBid}!`);

        return {
          ...state,
          players: newPlayers,
          properties: newProperties,
          phase: state.doublesCount > 0 ? 'ROLL' : 'END_TURN',
          auction: null,
          log: newLog,
        };
      } else if (newBidders.length === 0 || (newBidders.length === 1 && state.auction.highestBidderId === null)) {
        newLog.push(`No one bought ${BOARD_SPACES[state.auction.spaceId].name}.`);
        return {
          ...state,
          phase: state.doublesCount > 0 ? 'ROLL' : 'END_TURN',
          auction: null,
          log: newLog,
        };
      }

      const nextIndex = state.auction.currentBidderIndex % newBidders.length;
      
      return {
        ...state,
        auction: {
          ...state.auction,
          activeBidders: newBidders,
          currentBidderIndex: nextIndex,
        },
        log: newLog,
      };
    }

    default:
      return state;
  }
}

export function useMonopoly() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return { state, dispatch };
}
