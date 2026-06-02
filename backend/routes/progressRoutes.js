const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const { sessions } = require('./authRoutes');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getUser(req) {
  const sessionId = req.headers['x-session-id'];
  if (!sessionId) return null;
  return sessions.get(sessionId);
}

// GET /api/progress/summary
router.get('/summary', async (req, res) => {
  try {
    const user = getUser(req);
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    const workouts = await Workout.find({ userId: user.userId }).lean();

    if (workouts.length === 0) {
      return res.json({ hasData: false });
    }

    // current week Mon–Sun totals
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0=Mon … 6=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    workouts.forEach(w => {
      const d = new Date(w.date);
      if (d >= monday) {
        const idx = (d.getDay() + 6) % 7;
        weeklyData[idx] += w.duration;
      }
    });

    // count sessions per activity type
    const activityDistribution = {};
    workouts.forEach(w => {
      activityDistribution[w.activity] = (activityDistribution[w.activity] || 0) + 1;
    });

    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

    // day of week with most total minutes
    const minutesByDay = [0, 0, 0, 0, 0, 0, 0];
    workouts.forEach(w => {
      const idx = (new Date(w.date).getDay() + 6) % 7;
      minutesByDay[idx] += w.duration;
    });
    const mostActiveDay = DAYS[minutesByDay.indexOf(Math.max(...minutesByDay))];

    // current streak: consecutive days ending today
    const uniqueDays = [...new Set(
      workouts.map(w => new Date(w.date).toDateString())
    )].map(s => new Date(s)).sort((a, b) => b - a);

    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    for (const d of uniqueDays) {
      const diff = Math.round((cursor - d) / 86400000);
      if (diff <= 1) { streak++; cursor = d; } else break;
    }

    // highest ever streak
    const sortedDays = [...uniqueDays].sort((a, b) => a - b);
    let highestStreak = 0, currentRun = 0, prev = null;
    for (const d of sortedDays) {
      if (!prev || Math.round((d - prev) / 86400000) !== 1) currentRun = 1;
      else currentRun++;
      if (currentRun > highestStreak) highestStreak = currentRun;
      prev = d;
    }

    const longestSession = Math.max(...workouts.map(w => w.duration));
    const topActivity = Object.keys(activityDistribution).reduce((a, b) =>
      activityDistribution[a] >= activityDistribution[b] ? a : b
    );

    // best week: highest total minutes across any Mon–Sun window
    const allMondays = [...new Set(workouts.map(w => {
      const d = new Date(w.date);
      const mon = new Date(d);
      mon.setDate(d.getDate() - (d.getDay() + 6) % 7);
      mon.setHours(0, 0, 0, 0);
      return mon.getTime();
    }))];
    let bestWeek = 0;
    allMondays.forEach(monMs => {
      const sun = new Date(monMs + 6 * 86400000);
      sun.setHours(23, 59, 59, 999);
      const weekTotal = workouts
        .filter(w => new Date(w.date) >= new Date(monMs) && new Date(w.date) <= sun)
        .reduce((sum, w) => sum + w.duration, 0);
      if (weekTotal > bestWeek) bestWeek = weekTotal;
    });

    return res.json({
      hasData: true,
      stats: { totalWorkouts, totalMinutes, dayStreak: streak, mostActiveDay },
      weeklyData,
      activityDistribution,
      personalBests: { longestSession, topActivity, bestWeek, highestStreak },
    });
  } catch (err) {
    console.error('Progress summary error:', err);
    return res.status(500).json({ message: 'Failed to load progress data.' });
  }
});

module.exports = router;
