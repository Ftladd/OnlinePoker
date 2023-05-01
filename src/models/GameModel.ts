import { handleBets, resetDeck, dealCards, handleWinnings, placeBets } from './PokerModel';
import { getUserById } from './UserModel';

function playMatch(player1: Player, player2: Player, player3: Player, player4: Player): void {
  const playerArray = [player1, player2, player3, player4];
  const ANTE: number = 10;
  for (let i = 0; i < 3; i += 1) {
    let round = 1;
    handleBets(ANTE, playerArray);
    dealCards(playerArray);
    let bet = placeBets(playerArray);
    handleBets(bet, playerArray);
    while (round <= 4) {
      dealCards(playerArray);
      bet = placeBets(playerArray);
      handleBets(bet, playerArray);
      round += 1;
    }
    handleWinnings(playerArray);

    player1.folded = false;
    player2.folded = false;
    player3.folded = false;
    player4.folded = false;

    resetDeck(player1.hand, player2.hand, player3.hand, player4.hand);
  }
}

async function startGame(room: GameRoom): Promise<void> {
  const user1 = await getUserById(room.playerIds[0]);
  const user2 = await getUserById(room.playerIds[1]);
  const user3 = await getUserById(room.playerIds[2]);
  const user4 = await getUserById(room.playerIds[3]);

  const player1: Player = {
    balance: user1.stackSize,
    hand: [],
    folded: false,
    handRank: 0,
    userId: user1.userId,
    username: user1.username,
    bet: 0,
  };
  const player2: Player = {
    balance: user2.stackSize,
    hand: [],
    folded: false,
    handRank: 0,
    userId: user2.userId,
    username: user2.username,
    bet: 0,
  };
  const player3: Player = {
    balance: user3.stackSize,
    hand: [],
    folded: false,
    handRank: 0,
    userId: user3.userId,
    username: user3.username,
    bet: 0,
  };
  const player4: Player = {
    balance: user4.stackSize,
    hand: [],
    folded: false,
    handRank: 0,
    userId: user4.userId,
    username: user4.username,
    bet: 0,
  };

  const players = [player1, player2, player3, player4];
  // eslint-disable-next-line guard-for-in
  for (let i = 0; i < 4; i += 1) {
    room.playerUsernames.push(players[i].username);
    room.playerBankRolls.push(players[i].balance);
  }

  // playMatch(player1, player2, player3, player4);
}

export { startGame };
