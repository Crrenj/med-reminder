const form = document.getElementById('reminderForm');
const reminderList = document.getElementById('reminderList');

// URL du backend (en local, assurez-vous que le serveur Node.js tourne sur le port 3000)
const BACKEND_URL = 'http://localhost:3000/api/reminders';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const time = document.getElementById('time').value;

  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, time }),
  });

  if (response.ok) {
    const reminder = await response.json();
    displayReminder(reminder);
    form.reset();
  } else {
    alert('Failed to add reminder.');
  }
});

async function fetchReminders() {
  const response = await fetch(BACKEND_URL);
  if (response.ok) {
    const reminders = await response.json();
    reminders.forEach(displayReminder);
  }
}

function displayReminder({ name, time }) {
  const li = document.createElement('li');
  li.textContent = `${name} at ${time}`;
  reminderList.appendChild(li);
}

fetchReminders();
