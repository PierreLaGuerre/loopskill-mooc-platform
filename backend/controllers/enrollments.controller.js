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

function mapCourseFromEnrollmentRow(row) {
  return {
    id: row.courseId,
    title: row.courseTitle,
    description: row.courseDescription,
    category: row.courseCategory,
    level: row.courseLevel,
    requiredPlan: row.courseRequiredPlan,
    image: row.courseImage,
    tags: row.courseTags === "" ? [] : row.courseTags.split("|||"),
    isPopular: Boolean(row.courseIsPopular),
    instructor: row.courseInstructor,
    durationHours: row.courseDurationHours,
    lessonsCount: row.courseLessonsCount
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

async function getEnrollmentsByUser(userId, progressFilter) {
  const whereClauses = ["e.user_id = ?"];
  const params = [userId];

  if (progressFilter === "in-progress") {
    whereClauses.push("e.progress >= 0");
    whereClauses.push("e.progress < 100");
  }

  if (progressFilter === "completed") {
    whereClauses.push("e.progress = 100");
  }

  const [rows] = await db.query(
    `
      SELECT
        e.id,
        e.user_id AS userId,
        e.course_id AS courseId,
        e.progress,
        e.enrolled_at AS enrolledAt,
        c.title AS courseTitle,
        COALESCE(c.description, c.short_description) AS courseDescription,
        category.name AS courseCategory,
        c.level AS courseLevel,
        plan.name AS courseRequiredPlan,
        c.cover_image AS courseImage,
        COALESCE(
          GROUP_CONCAT(DISTINCT tag.name ORDER BY tag.name ASC SEPARATOR "|||"),
          ""
        ) AS courseTags,
        CASE
          WHEN c.id IN (
            SELECT popular_courses.id
            FROM (
              SELECT course.id
              FROM courses course
              LEFT JOIN enrollments enrollment
                ON enrollment.course_id = course.id
              GROUP BY course.id
              ORDER BY COUNT(enrollment.id) DESC, course.id ASC
              LIMIT 8
            ) AS popular_courses
          ) THEN TRUE
          ELSE FALSE
        END AS courseIsPopular,
        c.instructor_name AS courseInstructor,
        c.duration_hours AS courseDurationHours,
        c.lessons_count AS courseLessonsCount
      FROM enrollments e
      INNER JOIN courses c
        ON c.id = e.course_id
      LEFT JOIN categories category
        ON category.id = c.category_id
      LEFT JOIN plans plan
        ON plan.id = c.required_plan_id
      LEFT JOIN course_tags course_tag
        ON course_tag.course_id = c.id
      LEFT JOIN tags tag
        ON tag.id = course_tag.tag_id
      WHERE ${whereClauses.join(" AND ")}
      GROUP BY
        e.id,
        e.user_id,
        e.course_id,
        e.progress,
        e.enrolled_at,
        c.title,
        c.description,
        c.short_description,
        category.name,
        c.level,
        plan.name,
        c.cover_image,
        c.instructor_name,
        c.duration_hours,
        c.lessons_count
      ORDER BY e.enrolled_at DESC, e.id DESC
    `,
    params
  );

  return rows.map((row) => ({
    ...buildEnrollmentResponse(row),
    course: mapCourseFromEnrollmentRow(row)
  }));
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

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await getEnrollmentsByUser(req.authUser.id, "all");

    return sendSuccess(res, 200, "Enrollments retrieved successfully", {
      enrollments
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve enrollments");
  }
};

exports.getMyInProgressEnrollments = async (req, res) => {
  try {
    const enrollments = await getEnrollmentsByUser(req.authUser.id, "in-progress");

    return sendSuccess(res, 200, "In-progress enrollments retrieved successfully", {
      enrollments
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve in-progress enrollments");
  }
};

exports.getMyCompletedEnrollments = async (req, res) => {
  try {
    const enrollments = await getEnrollmentsByUser(req.authUser.id, "completed");

    return sendSuccess(res, 200, "Completed enrollments retrieved successfully", {
      enrollments
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve completed enrollments");
  }
};
