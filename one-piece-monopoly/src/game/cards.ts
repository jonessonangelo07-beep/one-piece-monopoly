import { Card } from './types';

export const CHANCE_CARDS: Card[] = [
  { id: 'chance_1', text: 'Advance to Go (Collect ฿200)', description: 'Move your token directly to the SET SAIL space and collect ฿200 from the bank.', actionType: 'advance_to', value: 0 },
  { id: 'chance_2', text: 'Advance to Enies Lobby. If you pass Go, collect ฿200', description: 'Move your token to Enies Lobby. If you pass the SET SAIL space along the way, collect ฿200 from the bank.', actionType: 'advance_to', value: 19 },
  { id: 'chance_3', text: 'Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.', description: 'Move your token to the closest Railroad space. If no one owns it, you can purchase it. If another player owns it, you must pay them double the normal rent.', actionType: 'advance_to_nearest', target: 'railroad' },
  { id: 'chance_4', text: 'Advance to the nearest Railroad. If unowned, you may buy it from the Bank. If owned, pay owner twice the rental to which they are otherwise entitled.', description: 'Move your token to the closest Railroad space. If no one owns it, you can purchase it. If another player owns it, you must pay them double the normal rent.', actionType: 'advance_to_nearest', target: 'railroad' },
  { id: 'chance_5', text: 'Advance to the nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total 10 times the amount thrown.', description: 'Move your token to the closest Utility space. If no one owns it, you can purchase it. If another player owns it, roll the dice and pay them 10 times the total rolled.', actionType: 'advance_to_nearest', target: 'utility' },
  { id: 'chance_6', text: 'Bank pays you dividend of ฿50', description: 'Collect ฿50 from the bank.', actionType: 'collect', value: 50 },
  { id: 'chance_7', text: 'Get Out of Impel Down Free', description: 'Keep this card until needed or traded. When in Impel Down, you can use this card to escape without paying the ฿50 fine.', actionType: 'get_out_of_jail_free' },
  { id: 'chance_8', text: 'Go Back 3 Spaces', description: 'Move your token backwards exactly 3 spaces and resolve the action of the space you land on.', actionType: 'move_back', value: 3 },
  { id: 'chance_9', text: 'Go to Impel Down. Go directly to Jail, do not pass Go, do not collect ฿200', description: 'Move your token directly to the Impel Down space. You do not collect ฿200 for passing SET SAIL. Your turn ends immediately.', actionType: 'go_to_jail' },
  { id: 'chance_10', text: 'Make general repairs on all your property. For each house pay ฿25, for each hotel pay ฿100', description: 'Pay the bank ฿25 for every house you own and ฿100 for every hotel you own across all your properties.', actionType: 'pay_per_building', houseCost: 25, hotelCost: 100 },
  { id: 'chance_11', text: 'Speeding fine ฿15', description: 'Pay ฿15 to the bank.', actionType: 'pay', value: 15 },
  { id: 'chance_12', text: 'Take a trip to Going Merry. If you pass Go, collect ฿200', description: 'Move your token to the Going Merry space. If you pass the SET SAIL space along the way, collect ฿200 from the bank.', actionType: 'advance_to', value: 5 },
  { id: 'chance_13', text: 'You have been elected Chairman of the Board. Pay each player ฿50', description: 'Pay ฿50 to every other active player in the game.', actionType: 'pay_to_all', value: 50 },
  { id: 'chance_14', text: 'Your building loan matures. Collect ฿150', description: 'Collect ฿150 from the bank.', actionType: 'collect', value: 150 },
  { id: 'chance_15', text: 'Bounty increased! Collect ฿100', description: 'Collect ฿100 from the bank.', actionType: 'collect', value: 100 },
];

export const COMMUNITY_CHEST_CARDS: Card[] = [
  { id: 'chest_1', text: 'Advance to Go (Collect ฿200)', description: 'Move your token directly to the SET SAIL space and collect ฿200 from the bank.', actionType: 'advance_to', value: 0 },
  { id: 'chest_2', text: 'Bank error in your favor. Collect ฿200', description: 'Collect ฿200 from the bank.', actionType: 'collect', value: 200 },
  { id: 'chest_3', text: 'Doctor\'s fee. Pay ฿50', description: 'Pay ฿50 to the bank.', actionType: 'pay', value: 50 },
  { id: 'chest_4', text: 'From sale of stock you get ฿50', description: 'Collect ฿50 from the bank.', actionType: 'collect', value: 50 },
  { id: 'chest_5', text: 'Get Out of Impel Down Free', description: 'Keep this card until needed or traded. When in Impel Down, you can use this card to escape without paying the ฿50 fine.', actionType: 'get_out_of_jail_free' },
  { id: 'chest_6', text: 'Go to Impel Down. Go directly to jail, do not pass Go, do not collect ฿200', description: 'Move your token directly to the Impel Down space. You do not collect ฿200 for passing SET SAIL. Your turn ends immediately.', actionType: 'go_to_jail' },
  { id: 'chest_7', text: 'Holiday fund matures. Receive ฿100', description: 'Collect ฿100 from the bank.', actionType: 'collect', value: 100 },
  { id: 'chest_8', text: 'Income tax refund. Collect ฿20', description: 'Collect ฿20 from the bank.', actionType: 'collect', value: 20 },
  { id: 'chest_9', text: 'It is your birthday. Collect ฿10 from every player', description: 'Collect ฿10 from every other active player in the game.', actionType: 'collect_from_all', value: 10 },
  { id: 'chest_10', text: 'Life insurance matures. Collect ฿100', description: 'Collect ฿100 from the bank.', actionType: 'collect', value: 100 },
  { id: 'chest_11', text: 'Pay hospital fees of ฿100', description: 'Pay ฿100 to the bank.', actionType: 'pay', value: 100 },
  { id: 'chest_12', text: 'Pay school fees of ฿50', description: 'Pay ฿50 to the bank.', actionType: 'pay', value: 50 },
  { id: 'chest_13', text: 'Receive ฿25 consultancy fee', description: 'Collect ฿25 from the bank.', actionType: 'collect', value: 25 },
  { id: 'chest_14', text: 'You are assessed for street repairs. ฿40 per house, ฿115 per hotel', description: 'Pay the bank ฿40 for every house you own and ฿115 for every hotel you own across all your properties.', actionType: 'pay_per_building', houseCost: 40, hotelCost: 115 },
  { id: 'chest_15', text: 'You have won second prize in a beauty contest. Collect ฿10', description: 'Collect ฿10 from the bank.', actionType: 'collect', value: 10 },
  { id: 'chest_16', text: 'You inherit ฿100', description: 'Collect ฿100 from the bank.', actionType: 'collect', value: 100 },
];

export function shuffleDeck(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}
