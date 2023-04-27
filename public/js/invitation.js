const form = document.querySelector('form');
const notificationDiv = document.querySelector('#notification');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const response = await fetch('/api/invitations', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if (response.ok) {
    notificationDiv.textContent = `Invitation sent to ${data.invitedUsernames}`;
  } else {
    notificationDiv.textContent = 'An error occurred while sending the invitation.';
  }
});
