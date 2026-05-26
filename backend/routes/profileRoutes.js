const express = require("express");
const router = express.Router();
const User = require("../models/User");

//input validation helper function
const validateProfileUpdate = (name, age, weight, height, gender, bio) => {
  const errors = [];

  //name validation
  if (!name || name.trim() === "") {
    errors.push("Name is required");
  } else if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  } else if (name.length > 50) {
    errors.push("Name cannot exceed 50 characters");
  }

  //age validation
  if (age !== undefined && age !== null && age !== "") {
    const ageNum = Number(age);
    if (isNaN(ageNum)) {
      errors.push("Age must be a number");
    } else if (ageNum < 13 || ageNum > 120) {
      errors.push("Age must be between 13 and 120");
    }
  }

  //weight validation
  if (weight !== undefined && weight !== null && weight !== "") {
    const weightNum = Number(weight);
    if (isNaN(weightNum)) {
      errors.push("Weight must be a number");
    } else if (weightNum < 20 || weightNum > 300) {
      errors.push("Weight must be between 20 kg and 300 kg");
    }
  }

  //height validation
  if (height !== undefined && height !== null && height !== "") {
    const heightNum = Number(height);
    if (isNaN(heightNum)) {
      errors.push("Height must be a number");
    } else if (heightNum < 100 || heightNum > 250) {
      errors.push("Height must be between 100 cm and 250 cm");
    }
  }

  //gender validation
  if (gender && !["male", "female", "other"].includes(gender.toLowerCase())) {
    errors.push("Gender must be male, female, or other");
  }

  //bio validation
  if (bio && bio.length > 500) {
    errors.push("Bio cannot exceed 500 characters");
  }

  return errors;
};

//1. GET profile - get user profile by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //check if userId is valid MongoDB ID
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message
    });
  }
});

//2. UPDATE profile - update user profile by ID
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, age, weight, height, gender, bio, profilePicture } = req.body;

    // Validate input
    const validationErrors = validateProfileUpdate(name, age, weight, height, gender, bio);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    //check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //update only provided fields
    if (name) user.name = name.trim();

    if (age !== undefined && age !== null && age !== "") {
    user.age = Number(age);
    }

    if (weight !== undefined && weight !== null && weight !== "") {
    user.weight = Number(weight);
    }

    if (height !== undefined && height !== null && height !== "") {
    user.height = Number(height);
    }

    if (gender) {
    user.gender = gender.toLowerCase();
    }

    if (bio !== undefined) {
    user.bio = bio;
    }

    if (profilePicture !== undefined) {
        user.profilePicture = profilePicture || null;
    }

    //update timestamp
    user.updatedAt = new Date();

    //save updated user
    await user.save();

    //return updated user (without password)
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
});

//3. DELETE account - delete user account by ID
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body; //require password for security

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account"
      });
    }

    //check if user exists
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //verify password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    //delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message
    });
  }
});

//4. CHANGE password - change user password by ID
router.put("/:userId/change-password", async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    //validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters"
      });
    }

    //get user with password
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    //update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message
    });
  }
});

//temp register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
});

//5. DEACTIVATE account - set isActive to false instead of deleting user
router.put("/:userId/deactivate", async (req, res) => {

  try {

    const { userId } = req.params;
    const { password } = req.body;

    //check password exists
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    //find user with password
    const user = await User.findById(userId).select("+password");

    //user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //verify password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    //deactivate account
    user.isActive = false;
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully"
    });

  } catch (error) {

    console.error("Deactivate account error:", error);

    res.status(500).json({
      success: false,
      message: "Error deactivating account",
      error: error.message
    });
  }
});

module.exports = router;
