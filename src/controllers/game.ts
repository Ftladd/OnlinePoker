import { DECK } from '../models/cards';

const player1Hand = [];
const player2Hand = [];
const player3Hand = [];
const player4Hand = [];
const player1Fold = false;
const player2Fold = false;
const player3Fold = false;
const player4Fold = false;

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

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

dealCards();

export { getRandomInt };
