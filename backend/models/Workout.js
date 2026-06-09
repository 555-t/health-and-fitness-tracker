const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  //calories: {type: Number,default: 0},
  //steps: {type: Number,default: 0},
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);
