// This is used to send messages from the server
// to a specific client or broadcast to multiple clients.
interface ServerToClientEvents {
  enteredChat: (msg: string) => void;
  exitedChat: (msg: string) => void;
  chatMessage: (name: string, msg: string) => void;
  addRaise: (from: string, amount: number, pot: number, stack: number) => void;
  fold: (from: string) => void;
  check: (from: string, pot: number) => void;
  joinGame: () => void;
  startGame: () => void;
  currentTurn: (turnPlayer: string) => void;
  endGameCheck: () => void;
  declareWinner: (from: string) => void;
}

// This is used for the messages from a client to the server
interface ClientToServerEvents {
  chatMessage: (msg: string) => void;
  raise: (amount: number) => void;
  fold: () => void;
  check: () => void;
  joinGame: () => void;
  endGame: () => void;
}
