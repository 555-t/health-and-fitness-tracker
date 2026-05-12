const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const auth = require("../middleware/auth");


// ===================== POST WORKOUT =====================
router.post("/workout", auth, async (req, res) => {
  try {
    const { activity, duration, date, time } = req.body;

  const workout = new Workout({
    userId: req.user.id,
    activity,
    duration,
    date,
    time
  });

  await workout.save();
    res.json({ message: "Workout saved" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== GET WORKOUTS =====================
router.get("/workout", auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ _id: -1 });
  res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== DELETE WORKOUT =====================
router.delete("/workout/:id",auth, async (req, res) => {
  try {
    await Workout.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
    });
    res.json({ message: "Workout deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== EXPORT ROUTER =====================
module.exports = router;