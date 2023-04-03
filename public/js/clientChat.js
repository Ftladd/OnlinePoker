const messages = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const chatMessage = document.getElementById('chatMessage');
const transfer = document.getElementById('transfer');

// eslint-disable-next-line no-undef
const socket = io();

socket.on('enteredChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('exitedChat', (msg) => {
  const item = document.createElement('li');
  item.classList.add('enterChatMessage');
  item.textContent = `${msg}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
