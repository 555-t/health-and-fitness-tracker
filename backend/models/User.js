const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  //basic Info
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
  },
  
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false //don't return password by default
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //profile fields
  age: {
    type: Number,
    min: [13, "Age must be at least 13"],
    max: [120, "Age must be realistic"],
    default: null
  },
  
  weight: {
    type: Number,
    min: [20, "Weight must be at least 20 kg"],
    max: [300, "Weight seems unrealistic"],
    default: null
  },
  
  height: {
    type: Number,
    default: null
  },
  
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null
  },
  
  bio: {
    type: String,
    maxlength: [500, "Bio cannot exceed 500 characters"],
    default: ""
  },
  
  profilePicture: {
    type: String,
    default: null
  },
  
  //account status
  isActive: {
    type: Boolean,
    default: true
}
}, {
    timestamps: true //automatically manage createdAt and updatedAt
}
);

//hash password before saving
userSchema.pre("save", async function () {

  //only hash if password modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});

//method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

