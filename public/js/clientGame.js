const socket = io();

const raiseButton = document.getElementById('raiseButton');
const raiseAmountInput = document.getElementById('raiseAmount');
const gameMessages = document.getElementById('gameMessages');

function raise() {
  const raiseAmountStr = raiseAmountInput.value;
  const raiseAmount = parseInt(raiseAmountStr, 10);
  if (raiseAmount < 1) {
    return;
  }
  socket.emit('raise', raiseAmount);
}
raiseButton.addEventListener('click', raise);

socket.on('addRaise', (from, amount, pot, stack) => {
  console.log('event recieved');
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} betted ${amount} chips.`;
  gameMessages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

raiseButton.addEventListener('submit', (e) => {
  e.preventDefault();
  if (raise.value) {
    socket.emit('raise', raise.value);
    raise.value = '';
  }
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
  window.scrollTo(0, document.body.scrollHeight);
});

const checkButton = document.getElementById('checkButton');
function check() {
  socket.emit('check');
}
checkButton.addEventListener('click', check);

socket.on('check', (from) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} checked`;
  window.scrollTo(0, document.body.scrollHeight);
});
