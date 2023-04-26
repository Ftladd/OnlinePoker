// eslint-disable-next-line no-undef
const socket = io();

socket.emit('joinGame');

socket.on('startGame', () => {
  window.location.href = '/game';
});
