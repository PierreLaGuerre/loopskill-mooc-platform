const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", verifyToken, authController.getMe);
router.patch("/profile", verifyToken, authController.updateProfile);
router.patch("/password", verifyToken, authController.changePassword);
router.patch("/interests", verifyToken, authController.updateInterests);
router.get("/session", verifyToken, authController.getSession);
router.get("/admin-access", verifyToken, requireRole("admin"), authController.getAdminAccess);

module.exports = router;
