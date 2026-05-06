const express = require("express");

const coursesController = require("../controllers/courses.controller");
const { attachAuthUserIfPresent } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/popular", coursesController.getPopularCourses);
router.get("/:id", attachAuthUserIfPresent, coursesController.getCourseById);
router.get("/", coursesController.getCourses);

module.exports = router;
