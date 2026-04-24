const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/session", verifyToken, authController.getSession);
router.get("/admin-access", verifyToken, requireRole("admin"), authController.getAdminAccess);

module.exports = router;
