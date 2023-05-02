const h2: Card = {
  suit: 'Heart',
  value: 2,
  rank: 13,
};
const h3: Card = {
  suit: 'Heart',
  value: 3,
  rank: 12,
};
const h4: Card = {
  suit: 'Heart',
  value: 4,
  rank: 11,
};
const h5: Card = {
  suit: 'Heart',
  value: 5,
  rank: 10,
};
const h6: Card = {
  suit: 'Heart',
  value: 6,
  rank: 9,
};
const h7: Card = {
  suit: 'Heart',
  value: 7,
  rank: 8,
};
const h8: Card = {
  suit: 'Heart',
  value: 8,
  rank: 7,
};
const h9: Card = {
  suit: 'Heart',
  value: 9,
  rank: 6,
};
const h10: Card = {
  suit: 'Heart',
  value: 10,
  rank: 5,
};
const hJack: Card = {
  suit: 'Heart',
  value: 11,
  rank: 4,
};
const hQueen: Card = {
  suit: 'Heart',
  value: 12,
  rank: 3,
};
const hKing: Card = {
  suit: 'Heart',
  value: 13,
  rank: 2,
};
const hAce: Card = {
  suit: 'Heart',
  value: 1,
  rank: 1,
};

const s2: Card = {
  suit: 'Spade',
  value: 2,
  rank: 13,
  name: '2♠️',
};
const s3: Card = {
  suit: 'Spade',
  value: 3,
  rank: 12,
  name: '3♠️',
};
const s4: Card = {
  suit: 'Spade',
  value: 4,
  rank: 11,
  name: '4♠️',
};
const s5: Card = {
  suit: 'Spade',
  value: 5,
  rank: 10,
  name: '5♠️',
};
const s6: Card = {
  suit: 'Spade',
  value: 6,
  rank: 9,
  name: '6♠️',
};
const s7: Card = {
  suit: 'Spade',
  value: 7,
  rank: 8,
  name: '7♠️',
};
const s8: Card = {
  suit: 'Spade',
  value: 8,
  rank: 7,
  name: '8♠️',
};
const s9: Card = {
  suit: 'Spade',
  value: 9,
  rank: 6,
  name: '9♠️',
};
const s10: Card = {
  suit: 'Spade',
  value: 10,
  rank: 5,
  name: '10♠️',
};
const sJack: Card = {
  suit: 'Spade',
  value: 11,
  rank: 4,
  name: 'J♠️',
};
const sQueen: Card = {
  suit: 'Spade',
  value: 12,
  rank: 3,
  name: 'Q♠️',
};
const sKing: Card = {
  suit: 'Spade',
  value: 13,
  rank: 2,
  name: 'K♠️',
};
const sAce: Card = {
  suit: 'Spade',
  value: 1,
  rank: 1,
  name: 'A♠️',
};

const d2: Card = {
  suit: 'Diamond',
  value: 2,
  rank: 13,
};
const d3: Card = {
  suit: 'Diamond',
  value: 3,
  rank: 12,
};
const d4: Card = {
  suit: 'Diamond',
  value: 4,
  rank: 11,
};
const d5: Card = {
  suit: 'Diamond',
  value: 5,
  rank: 10,
};
const d6: Card = {
  suit: 'Diamond',
  value: 6,
  rank: 9,
};
const d7: Card = {
  suit: 'Diamond',
  value: 7,
  rank: 8,
};
const d8: Card = {
  suit: 'Diamond',
  value: 8,
  rank: 7,
};
const d9: Card = {
  suit: 'Diamond',
  value: 9,
  rank: 6,
};
const d10: Card = {
  suit: 'Diamond',
  value: 10,
  rank: 5,
};
const dJack: Card = {
  suit: 'Diamond',
  value: 11,
  rank: 4,
};
const dQueen: Card = {
  suit: 'Diamond',
  value: 12,
  rank: 3,
};
const dKing: Card = {
  suit: 'Diamond',
  value: 13,
  rank: 2,
};
const dAce: Card = {
  suit: 'Diamond',
  value: 1,
  rank: 1,
};

const c2: Card = {
  suit: 'Club',
  value: 2,
  rank: 13,
  name: '2♣️',
};
const c3: Card = {
  suit: 'Club',
  value: 3,
  rank: 12,
  name: '3♣️',
};
const c4: Card = {
  suit: 'Club',
  value: 4,
  rank: 11,
  name: '4♣️',
};
const c5: Card = {
  suit: 'Club',
  value: 5,
  rank: 10,
  name: '5♣️',
};
const c6: Card = {
  suit: 'Club',
  value: 6,
  rank: 9,
  name: '6♣️',
};
const c7: Card = {
  suit: 'Club',
  value: 7,
  rank: 8,
  name: '7♣️',
};
const c8: Card = {
  suit: 'Club',
  value: 8,
  rank: 7,
  name: '8♣️',
};
const c9: Card = {
  suit: 'Club',
  value: 9,
  rank: 6,
  name: '9♣️',
};
const c10: Card = {
  suit: 'Club',
  value: 10,
  rank: 5,
  name: '10♣️',
};
const cJack: Card = {
  suit: 'Club',
  value: 11,
  rank: 4,
  name: 'J♣️',
};
const cQueen: Card = {
  suit: 'Club',
  value: 12,
  rank: 3,
  name: 'Q♣️',
};
const cKing: Card = {
  suit: 'Club',
  value: 13,
  rank: 2,
  name: 'K♣️',
};
const cAce: Card = {
  suit: 'Club',
  value: 1,
  rank: 1,
  name: 'A♣️',
};

const DECK: Array<Card> = [
  h2,
  h3,
  h4,
  h5,
  h6,
  h7,
  h8,
  h9,
  h10,
  hJack,
  hQueen,
  hKing,
  hAce,
  s2,
  s3,
  s4,
  s5,
  s6,
  s7,
  s8,
  s9,
  s10,
  sJack,
  sQueen,
  sKing,
  sAce,
  d2,
  d3,
  d4,
  d5,
  d6,
  d7,
  d8,
  d9,
  d10,
  dJack,
  dQueen,
  dKing,
  dAce,
  c2,
  c3,
  c4,
  c5,
  c6,
  c7,
  c8,
  c9,
  c10,
  cJack,
  cQueen,
  cKing,
  cAce,
];

export { DECK };
