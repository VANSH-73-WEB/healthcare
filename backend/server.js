require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const recordRoutes = require("./routes/recordRoutes");
const consentRoutes = require("./routes/consentRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "dhs-backend", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/consent", consentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`DHS backend running on http://localhost:${PORT}`);
  });
});
