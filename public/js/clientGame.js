const betting = document.getElementById('bet');

const socket = io();

betting.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseInt(document.getElementById('amount').value, 10);

  socket.emit('raise', amount);
});

socket.on('addRaise', (from, amount) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} betted ${amount} chips.`;
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('fold', (from) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} folded`;
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('check', (from) => {
  const item = document.createElement('li');
  item.classList.add('transferReceiveMessage');
  item.textContent = `${from} checked`;
  window.scrollTo(0, document.body.scrollHeight);
});
