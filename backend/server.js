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
const path = require('path');

/* =========================
   ROUTES
========================= */
const authRoutes = require('./routes/authRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const stepsRoutes = require('./routes/stepsRoutes');
const nutritionRoutes = require('./routes/nutritionRoutes');
const profileRoutes = require("./routes/profileRoutes");


console.log("trackerRoutes type:", typeof trackerRoutes);
console.log("stepsRoutes type:", typeof stepsRoutes);


const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use("/api/profile", profileRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


/* =========================
   STATIC FRONTEND
========================= */
app.use(express.static(path.join(__dirname, '../frontend')));

/* =========================
   DATABASE
========================= */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/getbuffd';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(5000, () => {
      console.log('Server running on http://localhost:5000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/* =========================
   FRONTEND ROUTE FALLBACK
========================= */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
