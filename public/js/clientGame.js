const socket = io();

const raiseButton = document.getElementById('raiseButton');
const raiseAmountInput = document.getElementById('raiseAmount');
const gameMessages = document.getElementById('gameMessages');
// const potDisplay = document.getElementById('potDisplay');

function raise() {
  const raiseAmountStr = raiseAmountInput.value;
  const raiseAmount = parseInt(raiseAmountStr, 10);
  if (raiseAmount < 1) {
    return;
  }
  socket.emit('raise', raiseAmount);
}
raiseButton.addEventListener('click', raise);

socket.on('addRaise', (from, amount, pot) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} betted ${amount} chips.\n Total Pot $${pot}`;
  gameMessages.appendChild(item);
  // item.textContent = `Total Pot $${pot}`;
  // potDisplay.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('currentTurn', (turnPlayer) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `It's ${turnPlayer}'s turn!'`;
  gameMessages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

const foldButton = document.getElementById('foldButton');
function fold() {
  socket.emit('fold');
}
foldButton.addEventListener('click', fold);

socket.on('fold', (from) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} folded`;
  gameMessages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

const checkButton = document.getElementById('checkButton');
function check() {
  socket.emit('check');
}
checkButton.addEventListener('click', check);

socket.on('check', (from, pot) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} checked \n Total Pot $${pot}`;
  gameMessages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('endGameCheck', () => {
  socket.emit('endGame');
});

socket.on('declareWinner', (from) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} Won!!!!`;
  gameMessages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
