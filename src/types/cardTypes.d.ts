type Card = {
  suit: string;
  value: number;
};
type Player = {
  balance: number;
  hand: Array<Card>;
  folded: boolean;
  handRank: number;
};
