require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const verificationRoutes = require("./routes/verification");
const donorRoutes = require("./routes/donors");

const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

connectDB();
app.get("/ping", (req, res) => {
  res.send("Correct backend instance");
});
app.use(cors());
app.use(express.json());

app.use("/api/donors", donorRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/hospital", hospitalRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});