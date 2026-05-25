const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  goal: {
    cal: { type: Number, default: 2000 },
    prot: { type: Number, default: 150 },
    carb: { type: Number, default: 200 },
    fat: { type: Number, default: 65 }
  },
  burned: {
    type: Number,
    default: 0
  },
  log: [{
    name: String,
    mealType: String,
    serving: Number,
    cal: Number,
    prot: Number,
    carb: Number,
    fat: Number
  }]
});

module.exports = mongoose.model("Nutrition", nutritionSchema);
