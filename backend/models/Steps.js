const mongoose = require("mongoose");

const stepsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  date: {
    type: String,
    required: true
  },
  steps: {
    type: Number,
    default: 0
  }
});

stepsSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Steps", stepsSchema);