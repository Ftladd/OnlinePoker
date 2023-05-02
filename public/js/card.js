const addCardBtn = document.getElementById('addCard');
const cardsContainer = document.getElementById('cards');

const suites = ['♣️', '♦️', '♠️', '♥️'];
const values = ['A', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeCardElement(value, suite) {
  const card = document.createElement('div');
  card.textContent = `${value} ${suite}`;
  return card;
}

function addCard() {
  const value = randomChoice(values);
  const suite = randomChoice(suites);
  const card = makeCardElement(value, suite);
  cardsContainer.appendChild(card);
}

for (let i = 0; i < 20; i += 1) {
  addCard();
}

addCardBtn.addEventListener('click', addCard);
