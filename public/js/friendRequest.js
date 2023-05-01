const form = document.querySelector('form');
const notificationDiv = document.querySelector('#notification');
const receiverUsernameInput = document.getElementById('receiverUsername');
// const senderUsernameInput = document.getElementById('senderUsername');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const receiverUsername = receiverUsernameInput.value;
  // const senderUsername = senderUsernameInput.value;
  // if (senderUsername === receiverUsername) {
  //   notificationDiv.textContent = `You cannot send friend request to yourself`;
  // }
  const requestBody = JSON.stringify({ receiverUsername });

  const response = await fetch('/api/friendRequest', {
    method: 'POST',
    body: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    notificationDiv.textContent = `Friend request sent to ${data.receiver.username}`;
  } else if (response.status === 400) {
    notificationDiv.textContent = 'You cannot send friend request to yourself';
  } else {
    notificationDiv.textContent = 'An error occurred while sending the friend request.';
  }
});
