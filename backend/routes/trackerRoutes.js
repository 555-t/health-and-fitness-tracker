const express = require('express');
const Workout = require('../models/Workout.js');
const { sessions } = require('./authRoutes');

const router = express.Router();

/* GET USER FROM SESSION */
function getUser(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return null;
  return sessions.get(sessionId);
}

/* CREATE WORKOUT */
router.post('/workouts', async (req, res) => {
  try {
    const user = getUser(req);

    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const workout = await Workout.create({
      userId: user.userId,
      activity: req.body.activity,
      duration: req.body.duration,
      //calories: req.body.calories || 0,
      //steps: req.body.steps || 0,
      date: req.body.date,
      time: req.body.time
    });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET WORKOUTS */
router.get('/workouts', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: "Not logged in" });

    const data = await Workout.find({ userId: user.userId });
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;