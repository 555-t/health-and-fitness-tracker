const mongoose = require("mongoose");

const stepsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  date: {
    type: String,
    required: true,
    unique: true // only 1 record per day
  },
  steps: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Steps", stepsSchema);