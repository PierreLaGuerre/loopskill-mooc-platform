const express = require("express");

const coursesController = require("../controllers/courses.controller");
const { attachAuthUserIfPresent, verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/popular", coursesController.getPopularCourses);
router.get("/recommended", verifyToken, coursesController.getRecommendedCourses);
router.get("/:id/lessons", attachAuthUserIfPresent, coursesController.getCourseLessons);
router.get("/:id", attachAuthUserIfPresent, coursesController.getCourseById);
router.get("/", coursesController.getCourses);

module.exports = router;
