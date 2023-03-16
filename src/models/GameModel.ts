import { handleBets, resetDeck, dealCards, handleWinnings, placeBets } from '../controllers/game';

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

export { playMatch };
