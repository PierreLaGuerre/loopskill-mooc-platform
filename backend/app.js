const express = require("express");
const cors = require("cors");
const { sendError } = require("./utils/http");

const app = express();

const authRoutes = require("./routes/auth.routes");
const coursesRoutes = require("./routes/courses.routes");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {res.json({ message: "Server is up and running" });});

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);

app.use((req, res) => {
  return sendError(res, 404, "Route not found");
});

app.use((error, req, res, next) => {
  if (error?.type === "entity.parse.failed") {
    return sendError(res, 400, "Malformed JSON body");
  }

  return sendError(res, 500, "Internal server error");
});

module.exports = app;
