require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Route imports
const reportRoutes = require("./routes/userReportRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const middleManRoutes = require("./routes/middleManRoutes");
const verificationRoutes = require("./routes/verification");
const donorRoutes = require("./routes/donors");
const hospitalProfileRoutes = require("./routes/hospitalProfile");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/ping", (req, res) => {
  res.send("Correct backend instance");
});

// Routes — Server 1
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/middleman", middleManRoutes);
app.use("/api/super-admin", require("./routes/superAdminRoutes"));

// Routes — Server 2
app.use("/api/hospital", hospitalProfileRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/verification", verificationRoutes);

// Connect DB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));