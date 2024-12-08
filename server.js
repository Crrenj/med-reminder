const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Stockage des rappels en mémoire (non persistant)
let reminders = [];

// POST: Ajouter un rappel
app.post('/api/reminders', (req, res) => {
  const { name, time } = req.body;

  if (!name || !time) {
    return res.status(400).json({ error: 'Name and time are required' });
  }

  const reminder = { name, time };
  reminders.push(reminder);
  res.status(201).json(reminder);
});

// GET: Récupérer tous les rappels
app.get('/api/reminders', (req, res) => {
  res.json(reminders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
