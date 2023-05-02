const form = document.querySelector('form');
const notificationDiv = document.querySelector('#notification');
const invitedUsernameInput = document.getElementById('invitedUsernames');
const roomNameInput = document.getElementById('roomName');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const invitedUsernames = invitedUsernameInput.value;
  const roomName = roomNameInput.value;

  const requestBody = JSON.stringify({ invitedUsernames, roomName });

  const response = await fetch('/api/invitations', {
    method: 'POST',
    body: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);

    notificationDiv.textContent = `Invitation sent to ${invitedUsernameInput.value}`;
  } else if (response.status === 400) {
    notificationDiv.textContent = 'You cannot send Invitation to yourself';
  } else {
    notificationDiv.textContent =
      'An error occurred while sending the invitation. User name does not exists!';
  }
});
