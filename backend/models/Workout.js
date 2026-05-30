const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
  },
  steps: {
    type: Number,
  },
  time: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);