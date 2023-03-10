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
type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

// type for friend request
type FriendRequest = {
  sender: string;
  receiver: string;
  status: 'pending' | 'accepted' | 'declined';
};

// Ranks is a type that represents an object with string keys and number values.
type Ranks = Record<string, number>;
