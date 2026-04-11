const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth.routes");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {res.json({ message: "Server is up and running" });});

app.use("/api/auth", authRoutes);

module.exports = app;