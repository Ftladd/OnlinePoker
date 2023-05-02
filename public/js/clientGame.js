const socket = io();

const raiseButton = document.getElementById('raiseButton');
const raiseAmountInput = document.getElementById('raiseAmount');

function raise() {
  const raiseAmountStr = raiseAmountInput.value;
  const raiseAmount = parseInt(raiseAmountStr, 10);
  if (raiseAmount < 1) {
    return;
  }
  socket.emit('raise', raiseAmount);
}
raiseButton.addEventListener('click', raise);

socket.on('addRaise', (from, amount) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} betted ${amount} chips.`;
  window.scrollTo(0, document.body.scrollHeight);
});

raiseButton.addEventListener('submit', (e) => {
  e.preventDefault();
  if (raiseAmountInput.value) {
    socket.emit('raiseAmountInput', raiseAmountInput.value);
    raiseAmountInput.value = '';
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
