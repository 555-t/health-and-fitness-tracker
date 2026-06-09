require("dotenv").config();

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set DNS servers:", e.message);
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const trackerRoutes = require("./routes/trackerRoutes");
const stepsRoutes = require("./routes/stepsRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const profileRoutes = require("./routes/profileRoutes");
const progressRoutes = require("./routes/progressRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/steps", stepsRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reminders", reminderRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// SPA catch-all route (Express 5 compatible)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/getbuffd";
console.log("Using URI:", MONGO_URI);
console.log("Connected DB:", mongoose.connection.name);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });