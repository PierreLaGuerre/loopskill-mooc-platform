const express = require("express");
const cors = require("cors");
const { sendError } = require("./utils/http");

const app = express();

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const coursesRoutes = require("./routes/courses.routes");
const enrollmentsRoutes = require("./routes/enrollments.routes");
const plansRoutes = require("./routes/plans.routes");
const paymentsRoutes = require("./routes/payments.routes");
const paymentsController = require("./controllers/payments.controller");

// Uses open CORS in local development, and restricts allowed origins when
// FRONTEND_ORIGIN is configured for deployment.

function getAllowedOrigins() {
  const rawOrigins = process.env.FRONTEND_ORIGIN;

  if (typeof rawOrigins !== "string" || rawOrigins.trim() === "") {
    return null;
  }

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "");
}

const allowedOrigins = getAllowedOrigins();

if (allowedOrigins == null) {
  app.use(cors());
} else {
  app.use(cors({
    origin: (origin, callback) => {
      if (origin == null || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    }
  }));
}
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentsController.handleWebhook
);

app.use(express.json());
app.use((req, res, next) => {
  if (req.body == null) {
    req.body = {};
  }

  next();
});

app.get("/api/health", (req, res) => {res.json({ message: "Server is up and running" });});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/plans", plansRoutes);
app.use("/api/payments", paymentsRoutes);

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
