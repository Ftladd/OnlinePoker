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
  userId: string;
  bet: number;
};

type DatabaseConstraintError = {
  type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
  columnName?: string;
  message?: string;
};

// For room management
type GameRoom = {
  player1Id: string | undefined;
  player2Id: string | undefined;
  player3Id: string | undefined;
  player4Id: string | undefined;
};

// req body type for friend request
type NewFriendRequest = {
  senderUsername: string;
  receiverUsername: string;
  status: 'pending' | 'accepted' | 'declined';
  friendRequestId: string;
};

type PrivateRoomRequest = {
  roomName: string;
};

type NewInvitation = {
  senderUsername: string;
  roomName: string;
  invitedUsernames: string;
  status: 'pending' | 'accepted' | 'declined';
  invitationId: string;
};

// Ranks is a type that represents an object with string keys and number values.
type Ranks = Record<string, number>;
