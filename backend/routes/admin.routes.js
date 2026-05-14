const express = require("express");

const adminCoursesController = require("../controllers/admin-courses.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(verifyToken, requireRole("admin"));

router.get("/categories", adminCoursesController.getAdminCategories);
router.get("/tags", adminCoursesController.getAdminTags);
router.get("/courses", adminCoursesController.getAdminCourses);
router.post("/courses", adminCoursesController.createAdminCourse);
router.get("/courses/:id", adminCoursesController.getAdminCourseById);
router.patch("/courses/:id", adminCoursesController.updateAdminCourse);
router.delete("/courses/:id", adminCoursesController.deleteAdminCourse);

module.exports = router;
