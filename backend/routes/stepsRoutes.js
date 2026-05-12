const express = require("express");
const router = express.Router(); 
const Steps = require("../models/Steps");
const auth = require("../middleware/auth");

// helper: get today as YYYY-MM-DD
function getToday() {
  return new Date().toISOString().split("T")[0];
}

// ===================== ADD / UPDATE STEPS =====================
router.post("/steps", auth, async (req, res) => {
  try {
    const { steps } = req.body;
  const today = getToday();

  let record = await Steps.findOne({
    userId: req.user.id,
    date: today
  });

  if (!record) {
    record = new Steps({
      userId: req.user.id,
      date: today,
      steps
    });
  } else {
    record.steps += steps;
  }

  await record.save();

  res.json({
    totalSteps: record.steps
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===================== GET TODAY STEPS =====================
router.get("/steps/today",auth, async (req, res) => {
  try {
    const today = getToday();

  const record = await Steps.findOne({
    userId: req.user.id,
    date: today
  });

  res.json({
    steps: record ? record.steps : 0,
    date: today
  });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;