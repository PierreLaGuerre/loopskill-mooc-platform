const express = require("express");

const enrollmentsController = require("../controllers/enrollments.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", verifyToken, enrollmentsController.createEnrollment);
router.get("/me/in-progress", verifyToken, enrollmentsController.getMyInProgressEnrollments);
router.get("/me/completed", verifyToken, enrollmentsController.getMyCompletedEnrollments);
router.get("/me", verifyToken, enrollmentsController.getMyEnrollments);

module.exports = router;
