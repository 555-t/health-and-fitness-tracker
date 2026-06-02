const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { sessions } = require('./authRoutes');

function getUser(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return null;
  return sessions.get(sessionId);
}

// GET /api/reminders
router.get('/', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    const reminder = await Reminder.findOne({ userId: user.userId }).lean();
    return res.json(reminder ? { delayMs: reminder.delayMs, label: reminder.label } : null);
  } catch (err) {
    console.error('Get reminder error:', err);
    return res.status(500).json({ message: 'Failed to fetch reminder.' });
  }
});

// POST /api/reminders — upsert the user's chosen delay
router.post('/', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    const { delayMs, label } = req.body;
    if (!delayMs || !label) {
      return res.status(400).json({ message: 'delayMs and label are required.' });
    }
    const reminder = await Reminder.findOneAndUpdate(
      { userId: user.userId },
      { delayMs, label, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    return res.json({ delayMs: reminder.delayMs, label: reminder.label });
  } catch (err) {
    console.error('Save reminder error:', err);
    return res.status(500).json({ message: 'Failed to save reminder.' });
  }
});

module.exports = router;
