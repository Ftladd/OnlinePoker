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
type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};
