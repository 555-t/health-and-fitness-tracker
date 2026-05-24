const express = require('express');
const Nutrition = require('../models/Nutrition.js');
const { sessions } = require('./authRoutes');

const router = express.Router();

/* GET USER FROM SESSION */
function getUser(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return null;
  return sessions.get(sessionId);
}

/* GET NUTRITION LOG FOR A DATE */
router.get('/:date', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Not logged in" });

    const data = await Nutrition.findOne({ userId: user.userId, date: req.params.date });
    if (!data) {
        return res.json({ log: [], goal: { cal: 2000, prot: 150, carb: 200, fat: 65 }, burned: 0 });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPSERT NUTRITION LOG FOR A DATE */
router.post('/', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Not logged in" });

    const { date, goal, log, burned } = req.body;

    const data = await Nutrition.findOneAndUpdate(
      { userId: user.userId, date: date },
      { goal, log, burned },
      { new: true, upsert: true }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
