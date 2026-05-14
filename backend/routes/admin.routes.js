const express = require("express");

const adminCoursesController = require("../controllers/admin-courses.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(verifyToken, requireRole("admin"));

router.get("/courses", adminCoursesController.getAdminCourses);
router.get("/courses/:id", adminCoursesController.getAdminCourseById);

module.exports = router;
