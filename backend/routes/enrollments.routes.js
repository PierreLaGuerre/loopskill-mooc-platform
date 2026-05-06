const express = require("express");

const enrollmentsController = require("../controllers/enrollments.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, enrollmentsController.createEnrollment);

module.exports = router;
