const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");
const { isDuplicateEntryError } = require("../utils/db-errors");

function normalizePositiveInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function buildEnrollmentResponse(row) {
  return {
    id: row.id,
    userId: row.userId,
    courseId: row.courseId,
    progress: row.progress,
    isCompleted: row.progress === 100,
    enrolledAt: row.enrolledAt
  };
}

async function getCourseById(courseId) {
  const [rows] = await db.query(
    "SELECT id FROM courses WHERE id = ? LIMIT 1",
    [courseId]
  );

  return rows[0] || null;
}

async function getEnrollmentByUserAndCourse(userId, courseId) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        user_id AS userId,
        course_id AS courseId,
        progress,
        enrolled_at AS enrolledAt
      FROM enrollments
      WHERE user_id = ? AND course_id = ?
      LIMIT 1
    `,
    [userId, courseId]
  );

  return rows[0] || null;
}

exports.createEnrollment = async (req, res) => {
  const courseId = normalizePositiveInteger(req.body.courseId);

  if (courseId == null) {
    return sendError(res, 400, "Validation failed", {
      courseId: "Course id must be a positive integer"
    });
  }

  try {
    const course = await getCourseById(courseId);

    if (course == null) {
      return sendError(res, 404, "Course not found");
    }

    const existingEnrollment = await getEnrollmentByUserAndCourse(req.authUser.id, courseId);

    if (existingEnrollment != null) {
      return sendError(res, 409, "Enrollment already exists", {
        courseId: "The user is already enrolled in this course"
      });
    }

    const [insertResult] = await db.query(
      "INSERT INTO enrollments (user_id, course_id, progress) VALUES (?, ?, 0)",
      [req.authUser.id, courseId]
    );
    const createdEnrollment = await getEnrollmentByUserAndCourse(req.authUser.id, courseId);

    return sendSuccess(res, 201, "Enrollment created successfully", {
      enrollment: buildEnrollmentResponse({
        ...createdEnrollment,
        id: createdEnrollment?.id ?? insertResult.insertId
      })
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return sendError(res, 409, "Enrollment already exists", {
        courseId: "The user is already enrolled in this course"
      });
    }

    return sendError(res, 500, "Could not create enrollment");
  }
};
