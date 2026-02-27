require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const reportRoutes = require("./routes/userReportRoutes");
const userRoutes = require("./routes/userRoutes");   // ← default export, no destructuring
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

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