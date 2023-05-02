import { DECK } from './CardModel';
import { room1 } from './RoomModel';

const activePlayers: number = 4; // The number of players who have not folded
let pot: number = 0; // The betting pool

// This generates a random integer. Taken from the JavaScript documentation.
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// function folded(): boolean {
//   const current: boolean = true;
//   return current;
// }

/* Deals 5 cards to a player upon joining game
 */
function dealCards(username: string): void {
  const deal = getRandomInt(0, DECK.length);
  for (let i = 0; i < room1.playerUsernames.length; i += 1) {
    if (username === room1.playerUsernames[i]) {
      room1.playerHands[i].push(DECK[deal]);
      DECK.splice(deal, 1);
      room1.playerHands[i].push(DECK[deal]);
      DECK.splice(deal, 1);
      room1.playerHands[i].push(DECK[deal]);
      DECK.splice(deal, 1);
      room1.playerHands[i].push(DECK[deal]);
      DECK.splice(deal, 1);
      room1.playerHands[i].push(DECK[deal]);
      DECK.splice(deal, 1);
    }
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
function placeBets(playerArray: Player[]): number {
  let maxBet = 0;

  for (let i = 0; i < playerArray.length; i += 1) {
    // prompt for fold
    if (!playerArray[i].folded) {
      // prompt for bet
      maxBet = playerArray[i].bet;
    }
  }

  while (
    playerArray[0].bet < maxBet ||
    playerArray[1].bet < maxBet ||
    playerArray[2].bet < maxBet ||
    playerArray[3].bet < maxBet
  ) {
    // prompt player for fold, if yes -1 from activePlayers
    for (let i = 0; i < playerArray.length; i += 1) {
      if (!playerArray[i].folded) {
        if (playerArray[i].bet < maxBet) {
          // prompt player for bet
          maxBet = playerArray[i].bet;
        }
      }
    }
  }
  return maxBet;
}

/* I'm happy with this function. It subtracts the bet amount from each player
 * that hasn't folded and adds it to the pot. It takes the current bet amount
 * as a parameter -Finn
 */
function handleBets(bet: number, playerArray: Player[]): void {
  pot += bet * activePlayers;
  for (let i = 0; i < playerArray.length; i += 1) {
    if (!playerArray[i].folded) {
      playerArray[i].balance -= bet;
    }
  }
}

// function to check the hand rank
function checkHandRank(hand: Card[]): number {
  // Initialize an object to store the count of each rank
  const ranks: Ranks = {};
  // Initialize boolean flags for flush and straight
  let flush = true;
  let straight = false;

  // Loop through the cards in the hand
  for (let i = 0; i < hand.length; i += 1) {
    // Get the rank and suit of the current card
    const { rank } = hand[i];
    const { suit } = hand[i];

    // Update the rank count for the current rank
    if (ranks[rank]) {
      ranks[rank] += 1;
    } else {
      ranks[rank] = 1;
    }

    // Check if all the cards have the same suit
    if (i < hand.length - 1) {
      if (suit !== hand[i + 1].suit) {
        flush = false;
      }
    }
  }

  // Get an array of the rank counts to store the count of each rank in the hand
  const rankCounts = [];

  // Push the count of each rank into rankCounts array
  for (const rank of Object.keys(ranks)) {
    rankCounts.push(ranks[rank]);
  }

  // Check for different types of hand ranking: four of a kind, full house, two pair, and pair
  let hasFourOfAKind = false;
  let hasThreeOfAKind = false;
  let hasTwoPair = false;
  let hasPair = false;

  for (let i = 0; i < rankCounts.length; i += 1) {
    // Check for four of a kind. If four of a kind found,
    // there's no need to check the remaining elements in rankCounts.
    if (rankCounts[i] === 4) {
      hasFourOfAKind = true;
      break;
    }
    // Check for three of a kind
    if (rankCounts[i] === 3) {
      hasThreeOfAKind = true;
    }
    // Check for pairs
    if (rankCounts[i] === 2) {
      if (hasPair) {
        hasTwoPair = true;
      }
      hasPair = true;
    }
  }

  // Check for straight
  const sortedRanks = [];
  // Push each rank into the sortedRanks array
  for (const rank of Object.keys(ranks)) {
    sortedRanks.push(rank);
  }
  // Sort the array of ranks numerically in ascending order by converting the
  // values from strings to numbers using the Number() function.
  sortedRanks.sort((a, b) => Number(a) - Number(b));

  if (sortedRanks.length === 5) {
    // Check for a straight (five sequential ranks)
    if (Number(sortedRanks[4]) - Number(sortedRanks[0]) === 4) {
      straight = true;
    }
    // Check for a special case of a straight (A-5 straight)
  } else if (sortedRanks.length === 4 && sortedRanks[0] === '2' && sortedRanks[3] === '5') {
    straight = true;
  }

  // Assign rank based on the highest combination
  if (flush && straight && sortedRanks[4] === 'A') {
    return 10; // Royal flush
  }

  if (flush && straight) {
    return 9; // Straight flush
  }

  if (hasFourOfAKind) {
    return 8; // Four of a kind
  }

  if (hasThreeOfAKind && hasPair) {
    return 7; // Full house
  }

  if (flush) {
    return 6; // Flush
  }

  if (straight) {
    return 5; // Straight
  }

  if (hasThreeOfAKind) {
    return 4; // Three of a kind
  }

  if (hasTwoPair) {
    return 3; // Two pair
  }

  if (hasPair) {
    return 2; // Pair
  }

  return 1; // High card
}

// function for determining winner
function determineWinner(player_array: Array<Player>): number {
  // Initialize a variable to keep track of the highest hand rank found so far
  let maxRank = 0;
  // Initialize a variable to keep track of the index of the player with the highest hand rank
  let winnerIndex = -1;

  // Loop through each player
  for (let i = 0; i < player_array.length; i += 1) {
    // call checkHandRank to determine the rank of the player's hand
    const rank = checkHandRank(player_array[i].hand);

    // If the current player's rank is higher than the current max rank, update the max rank and winner index
    if (rank > maxRank) {
      maxRank = rank;
      winnerIndex = i;
    }
    // If there is a tie, compare the next highest ranking card in each hand
    else if (rank === maxRank) {
      let j = 0;
      let winnerFound = false;
      while (!winnerFound) {
        const player1Card = player_array[winnerIndex].hand[j];
        const player2Card = player_array[i].hand[j];

        // If player 2 has a higher card, update the winner index and break out of the loop
        if (player2Card.value > player1Card.value) {
          winnerIndex = i;
          winnerFound = true;
        }
        // If player 1 has a higher card, break out of the loop
        else if (player1Card.value > player2Card.value) {
          winnerFound = true;
        }
        // If the players have the same highest card, compare the next highest card
        else {
          j += 1;
        }

        // If both players have the same cards, it's a tie
        if (j >= player_array[winnerIndex].hand.length || j >= player_array[i].hand.length) {
          winnerIndex = -1;
          winnerFound = true;
        }
      }
    }
  }

  return winnerIndex;
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
function handleWinnings(playerArray: Player[]): void {
  if (activePlayers > 1) {
    const winner = determineWinner(playerArray);
    if (winner === 0) {
      playerArray[0].balance += pot;
    } else if (winner === 1) {
      playerArray[1].balance += pot;
    } else if (winner === 2) {
      playerArray[2].balance += pot;
    } else if (winner === 3) {
      playerArray[3].balance += pot;
    } /* else if (winner === 'Player1&2') {
      player1.balance += pot / 2;
      player2.balance += pot / 2;
    } else if (winner === 'Player1&3') {
      player1.balance += pot / 2;
      player3.balance += pot / 2;
    } else if (winner === 'Player1&4') {
      player1.balance += pot / 2;
      player4.balance += pot / 2;
    } else if (winner === 'Player2&3') {
      player2.balance += pot / 2;
      player3.balance += pot / 2;
    } else if (winner === 'Player2&4') {
      player2.balance += pot / 2;
      player4.balance += pot / 2;
    } else if (winner === 'Player3&4') {
      player3.balance += pot / 2;
      player4.balance += pot / 2;
    } else if (winner === 'Player1&2&3') {
      player1.balance += pot / 3;
      player2.balance += pot / 3;
      player3.balance += pot / 3;
    } else if (winner === 'Player1&2&4') {
      player1.balance += pot / 3;
      player2.balance += pot / 3;
      player4.balance += pot / 3;
    } else if (winner === 'Player 1&3&4') {
      player1.balance += pot / 3;
      player3.balance += pot / 3;
      player4.balance += pot / 3;
    } else if (winner === 'Player2&3&4') {
      player2.balance += pot / 3;
      player3.balance += pot / 3;
      player4.balance += pot / 3;
    } */ else {
      for (let i = 0; i < playerArray.length; i += 1) {
        playerArray[i].balance += pot / 4;
      }
    }
  } else {
    for (let i = 0; i < playerArray.length; i += 1) {
      playerArray[i].balance += pot / 4;
    }
  }
  pot = 0;
}

function resetDeck(
  hand1: Array<Card>,
  hand2: Array<Card>,
  hand3: Array<Card>,
  hand4: Array<Card>
): void {
  const player1Length = hand1.length;
  const player2Length = hand2.length;
  const player3Length = hand3.length;
  const player4Length = hand4.length;
  for (let i = 0; i < player1Length; i += 1) {
    DECK.push(hand1[0]);
    hand1.splice(0, 1);
  }
  for (let i = 0; i < player2Length; i += 1) {
    DECK.push(hand2[0]);
    hand2.splice(0, 1);
  }
  for (let i = 0; i < player3Length; i += 1) {
    DECK.push(hand3[0]);
    hand3.splice(0, 1);
  }
  for (let i = 0; i < player4Length; i += 1) {
    DECK.push(hand4[0]);
    hand4.splice(0, 1);
  }
}

export { resetDeck, handleBets, handleWinnings, dealCards, placeBets };
