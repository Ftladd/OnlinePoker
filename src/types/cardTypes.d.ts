type Card = {
  suit: string;
  value: number;
  rank: number;
};
type Player = {
  balance: number;
  hand: Array<Card>;
  folded: boolean;
  handRank: number;
};

// Ranks is a type that represents an object with string keys and number values.
type Ranks = Record<string, number>;
