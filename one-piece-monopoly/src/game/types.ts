export type SpaceGroup = 'Brown' | 'LightBlue' | 'Pink' | 'Orange' | 'Red' | 'Yellow' | 'Green' | 'DarkBlue' | 'Railroad' | 'Utility' | 'Special';

export type SpaceType = 'property' | 'railroad' | 'utility' | 'chance' | 'chest' | 'tax' | 'go' | 'jail' | 'parking' | 'gotojail';

export type CardActionType = 
  | 'advance_to'
  | 'advance_to_nearest'
  | 'collect'
  | 'pay'
  | 'pay_per_building'
  | 'collect_from_all'
  | 'pay_to_all'
  | 'go_to_jail'
  | 'get_out_of_jail_free'
  | 'move_back';

export interface Card {
  id: string;
  text: string;
  description: string;
  actionType: CardActionType;
  value?: number;
  target?: 'railroad' | 'utility';
  houseCost?: number;
  hotelCost?: number;
}

export interface Space {
  id: number;
  name: string;
  type: SpaceType;
  group: SpaceGroup;
  price?: number;
  rent?: number[]; // [base, 1 house, 2 house, 3 house, 4 house, hotel]
  houseCost?: number;
  color?: string;
  icon?: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  borderColor: string;
  textColor: string;
  icon: string;
  money: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  bankrupt: boolean;
  getOutOfJailFreeCards: number;
  isBot: boolean;
}

export interface TradeOffer {
  fromPlayerId: number;
  toPlayerId: number;
  offerMoney: number;
  offerProperties: number[];
  offerCards: number;
  requestMoney: number;
  requestProperties: number[];
  requestCards: number;
}

export interface PropertyState {
  spaceId: number;
  ownerId: number | null;
  houses: number;
  mortgaged: boolean;
}

export type GamePhase = 'SETUP' | 'ROLL' | 'ACTION' | 'END_TURN' | 'GAME_OVER' | 'AUCTION';

export interface PendingAction {
  type: 'BUY_PROPERTY' | 'PAY_RENT' | 'PAY_TAX' | 'CHANCE' | 'CHEST' | 'JAIL_DECISION' | 'BANKRUPT' | 'GO_TO_JAIL';
  space?: Space;
  amount?: number;
  ownerId?: number;
  message?: string;
}

export interface AuctionState {
  spaceId: number;
  currentBid: number;
  highestBidderId: number | null;
  activeBidders: number[];
  currentBidderIndex: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  properties: Record<number, PropertyState>;
  phase: GamePhase;
  dice: [number, number];
  rollCount: number;
  doublesCount: number;
  log: string[];
  pendingAction: PendingAction | null;
  tradeOffer: TradeOffer | null;
  auction: AuctionState | null;
  isPaused: boolean;
  chanceDeck: Card[];
  chestDeck: Card[];
  activeCard: { type: 'chance' | 'chest', card: Card } | null;
}
