const express = require('express');
const Steps = require('../models/Steps');
const { sessions } = require('./authRoutes');

const router = express.Router();

function getUser(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return null;
  return sessions.get(sessionId);
}

/* ADD STEPS */
router.post('/', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Not logged in" });

    const { date, steps } = req.body;

    const updated = await Steps.findOneAndUpdate(
      { userId: user.userId, date },
      { $inc: { steps } },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET STEPS */
router.get('/', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Not logged in" });

    const data = await Steps.find({ userId: user.userId });
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;