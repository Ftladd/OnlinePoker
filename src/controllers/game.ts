import { DECK } from '../models/cards';

// The players' hands are stored as arrays of Card objects
const player1Hand: Array<Card> = [];
const player2Hand: Array<Card> = [];
const player3Hand: Array<Card> = [];
const player4Hand: Array<Card> = [];

// This boolean keeps track of whether or not a particular player has folded
let player1Fold: boolean = false;
let player2Fold: boolean = false;
let player3Fold: boolean = false;
let player4Fold: boolean = false;

/* These variables keep track of each player's balance. This will need to be
 * imported from our SQL database at the beginning of the game and then exported
 * back into the database at the end. -Finn
 */
let player1Balance: number = 0;
let player2Balance: number = 0;
let player3Balance: number = 0;
let player4Balance: number = 0;

/* These variables keep track of the "rank" of each players' hand. It is used
 * at the end of each round to determine the winner(s)
 */
let player1HandRank: number = 0;
let player2HandRank: number = 0;
let player3HandRank: number = 0;
let player4HandRank: number = 0;

let activePlayers: number = 4; // The number of players who have not folded
const ANTE: number = 10; // The minimum bet that is paid at the beginning of each round
let pot: number = 0; // The betting pool

// This generates a random integer. Taken from the JavaScript documentation.
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

/* Happy with this function. It will generate a random integer and push the Card
 * at that index from the DECK array into the PlayerHand array. It will then
 * remove that same card from the deck array so that it cannot be "dealt" again.
 * If a player has chosen to fold at the most recent betting step they will not
 * be dealt a card. -Finn
 */
function dealCards(): void {
  if (!player1Fold) {
    const deal = getRandomInt(0, DECK.length - 1);
    player1Hand.push(DECK[deal]);
    DECK.splice(deal, 1);
  }
  if (!player2Fold) {
    const deal = getRandomInt(0, DECK.length - 1);
    player2Hand.push(DECK[deal]);
    DECK.splice(deal, 1);
  }
  if (!player3Fold) {
    const deal = getRandomInt(0, DECK.length - 1);
    player3Hand.push(DECK[deal]);
    DECK.splice(deal, 1);
  }
  if (!player4Fold) {
    const deal = getRandomInt(0, DECK.length - 1);
    player4Hand.push(DECK[deal]);
    DECK.splice(deal, 1);
  }
}

/* Fairly happy with this function. It should prompt each player if they want to
 * fold or not, and if they don't then prompt them for a bet. It should only
 * accept bet amounts >= the current maxBet. If a player's current bet is < the
 * maxBet it will prompt them again until all players have either bet the same
 * amount or folded.
 * Chris asked me to type up the user input stuff in python and send it to
 * him so he could convert it to something we can use in typescript, so I
 * just have placeholder comments for now. -Finn
 */
function placeBets(): number {
  let maxBet = 0;
  // eslint-disable-next-line prefer-const
  let player1Bet = 0;
  // eslint-disable-next-line prefer-const
  let player2Bet = 0;
  // eslint-disable-next-line prefer-const
  let player3Bet = 0;
  // eslint-disable-next-line prefer-const
  let player4Bet = 0;

  // prompt player1 for fold
  if (!player1Fold) {
    // prompt player1 for bet
    maxBet = player1Bet;
  }
  // prompt player2 for fold
  if (!player2Fold) {
    // prompt player2 for bet
    maxBet = player2Bet;
  }
  // prompt player3 for fold
  if (!player3Fold) {
    // prompt player3 for bet
    maxBet = player3Bet;
  }
  // prompt player4 for fold
  if (!player4Fold) {
    // prompt player4 for bet
    maxBet = player4Bet;
  }
  while (player1Bet < maxBet || player2Bet < maxBet || player3Bet < maxBet || player4Bet < maxBet) {
    // prompt player1 for fold, if yes -1 from activePlayers
    if (!player1Fold) {
      if (player1Bet < maxBet) {
        // prompt player1 for bet
        maxBet = player1Bet;
      }
    }
    // prompt player2 for fold, if yes -1 from activePlayers
    if (!player2Fold) {
      if (player2Bet < maxBet) {
        // prompt player2 for bet
        maxBet = player2Bet;
      }
    }
    // prompt player3 for fold, if yes -1 from activePlayers
    if (!player3Fold) {
      if (player3Bet < maxBet) {
        // prompt player3 for bet
        maxBet = player3Bet;
      }
    }
    // prompt player4 for fold, if yes -1 from activePlayers
    if (!player4Fold) {
      if (player4Bet < maxBet) {
        // prompt player4 for bet
        maxBet = player4Bet;
      }
    }
  }
  return maxBet;
}

/* I'm happy with this function. It subtracts the bet amount from each player
 * that hasn't folded and adds it to the pot. It takes the current bet amount
 * as a parameter -Finn
 */
function handleBets(bet: number): void {
  pot += bet * activePlayers;
  if (!player1Fold) {
    player1Balance -= bet;
  }
  if (!player2Fold) {
    player2Balance -= bet;
  }
  if (!player3Fold) {
    player3Balance -= bet;
  }
  if (!player4Fold) {
    player4Balance -= bet;
  }
}

/* This should determine the value of each player's hand and rank it from 1 to
 * 10, with 10 being the best. If they folded it should return 0. This is used
 * in the "showdown" function to determine the winners. Takes two parameters,
 * the "hand" array of the player, and the boolean checking whether or not they
 * folded. -Finn
 */
function handChecker(hand: Array<Card>, folded: boolean): number {
  let handRank: number = 0;
  if (!folded) {
    const sum: number = hand[0].value + hand[1].value + hand[2].value + hand[3].value;
    let flushCheck: boolean = false;
    if (
      hand[0].suit === hand[1].suit &&
      hand[0].suit === hand[2].suit &&
      hand[0].suit === hand[3].suit
    ) {
      flushCheck = true;
    }
    if (sum === 60 && flushCheck === true) {
      handRank = 10; // Royal Flush
    }
  }
  return handRank;
}

/* This should compare all the players hands by rank from 1 to 10 and return a
 * string indicating which player or players have the best hand. This is checked
 * in the "handChecker" function. It's return value is used in the
 * "handleWinnings" function to split the pot accordingly. -Finn
 */
function showdown(): string {
  let bestHand: string = '';
  player1HandRank = handChecker(player1Hand, player1Fold);
  player2HandRank = handChecker(player2Hand, player2Fold);
  player3HandRank = handChecker(player3Hand, player3Fold);
  player4HandRank = handChecker(player4Hand, player4Fold);
  if (
    player1HandRank > player2HandRank &&
    player1HandRank > player3HandRank &&
    player1HandRank > player4HandRank
  ) {
    bestHand = 'Player1';
  } else if (
    player2HandRank > player1HandRank &&
    player2HandRank > player3HandRank &&
    player2HandRank > player4HandRank
  ) {
    bestHand = 'Player2';
  } else if (
    player3HandRank > player2HandRank &&
    player3HandRank > player1HandRank &&
    player3HandRank > player4HandRank
  ) {
    bestHand = 'Player3';
  } else if (
    player4HandRank > player2HandRank &&
    player4HandRank > player3HandRank &&
    player4HandRank > player1HandRank
  ) {
    bestHand = 'Player4';
  }
  return bestHand;
}

/* This function checks the string that is returned from the "showdown" function
 * and uses it to determine how to split the pot. Currently it does this by
 * checking if there is more than 1 active player. If there isn't then it just
 * gives the pot to whoever hasn't folded. Otherwise it checks for every
 * possible combination of winners. The final else statement exists because I'm
 * pretty sure with the current game logic it is possible for all 4 players to
 * fold. The entire function seems very inefficient to me but I haven't been
 * able to think of a better way to do it. -Finn
 */
function handleWinnings(): void {
  if (activePlayers > 1) {
    const winner = showdown();
    if (winner === 'Player1') {
      player1Balance += pot;
    } else if (winner === 'Player2') {
      player2Balance += pot;
    } else if (winner === 'Player3') {
      player3Balance += pot;
    } else if (winner === 'Player4') {
      player4Balance += pot;
    } else if (winner === 'Player1&2') {
      player1Balance += pot / 2;
      player2Balance += pot / 2;
    } else if (winner === 'Player1&3') {
      player1Balance += pot / 2;
      player3Balance += pot / 2;
    } else if (winner === 'Player1&4') {
      player1Balance += pot / 2;
      player4Balance += pot / 2;
    } else if (winner === 'Player2&3') {
      player2Balance += pot / 2;
      player3Balance += pot / 2;
    } else if (winner === 'Player2&4') {
      player2Balance += pot / 2;
      player4Balance += pot / 2;
    } else if (winner === 'Player3&4') {
      player3Balance += pot / 2;
      player4Balance += pot / 2;
    } else if (winner === 'Player1&2&3') {
      player1Balance += pot / 3;
      player2Balance += pot / 3;
      player3Balance += pot / 3;
    } else if (winner === 'Player1&2&4') {
      player1Balance += pot / 3;
      player2Balance += pot / 3;
      player4Balance += pot / 3;
    } else if (winner === 'Player 1&3&4') {
      player1Balance += pot / 3;
      player3Balance += pot / 3;
      player4Balance += pot / 3;
    } else if (winner === 'Player2&3&4') {
      player2Balance += pot / 3;
      player3Balance += pot / 3;
      player4Balance += pot / 3;
    } else {
      player1Balance += pot / 4;
      player2Balance += pot / 4;
      player3Balance += pot / 4;
      player4Balance += pot / 4;
    }
  } else if (!player1Fold) {
    player1Balance += pot;
  } else if (!player2Fold) {
    player2Balance += pot;
  } else if (!player3Fold) {
    player3Balance += pot;
  } else if (!player4Fold) {
    player4Balance += pot;
  } else {
    player1Balance += pot / 4;
    player2Balance += pot / 4;
    player3Balance += pot / 4;
    player4Balance += pot / 4;
  }
}

/* This function handles each individual round in a match. At the end of the
 * round it will reset the player's "folded" status to false and the active
 * players to 4 in preparation for the next round. -Finn
 */
function playRound(): void {
  handleBets(ANTE);
  dealCards();
  let bet = placeBets();
  handleBets(bet);
  if (activePlayers > 1) {
    dealCards();
    bet = placeBets();
    handleBets(bet);
  }
  if (activePlayers > 1) {
    dealCards();
    bet = placeBets();
    handleBets(bet);
  }
  if (activePlayers > 1) {
    dealCards();
    bet = placeBets();
    handleBets(bet);
  }
  if (activePlayers > 1) {
    dealCards();
    bet = placeBets();
    handleBets(bet);
  }
  handleWinnings();
  activePlayers = 4;
  player1Fold = false;
  player2Fold = false;
  player3Fold = false;
  player4Fold = false;
}

function resetDeck(
  hand1: Array<Card>,
  hand2: Array<Card>,
  hand3: Array<Card>,
  hand4: Array<Card>
): void {
  /* This needs to push the cards from each players hand back into the DECK
  array. Since we're just pulling them out in at random it doesn't matter what
  order the DECK is in at the start of each round -Finn
  */
}

// This function will handle the entirety of a 3-round match
function playMatch(): void {
  for (let i = 0; i < 3; i += 1) {
    playRound();
    resetDeck(player1Hand, player2Hand, player3Hand, player4Hand);
  }
}

export { playMatch };
