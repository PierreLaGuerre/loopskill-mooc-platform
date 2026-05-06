const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");

const DEFAULT_COURSE_ORDER = "c.id ASC";
const MIN_POPULAR_COURSE_RESULTS = 6;
const POPULAR_COURSE_LIMIT = 8;

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeText(item))
      .filter((item) => item !== "");
  }

  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function buildCourseListFilters(query) {
  return {
    category: normalizeText(query.category),
    level: normalizeText(query.level).toLowerCase(),
    search: normalizeText(query.search),
    tags: normalizeList(query.tags)
  };
}

function normalizePositiveInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function buildCourseSelectQuery({ whereClauses = [], params = [], orderBy = DEFAULT_COURSE_ORDER } = {}) {
  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  return {
    sql: `
      SELECT
        c.id,
        c.title,
        COALESCE(c.description, c.short_description) AS description,
        category.name AS category,
        c.level,
        plan.name AS requiredPlan,
        c.cover_image AS image,
        COALESCE(
          GROUP_CONCAT(DISTINCT tag.name ORDER BY tag.name ASC SEPARATOR "|||"),
          ""
        ) AS tags,
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
              LIMIT ${POPULAR_COURSE_LIMIT}
            ) AS popular_courses
          ) THEN TRUE
          ELSE FALSE
        END AS isPopular,
        c.instructor_name AS instructor,
        c.duration_hours AS durationHours,
        c.lessons_count AS lessonsCount
      FROM courses c
      LEFT JOIN categories category
        ON category.id = c.category_id
      LEFT JOIN plans plan
        ON plan.id = c.required_plan_id
      LEFT JOIN course_tags course_tag
        ON course_tag.course_id = c.id
      LEFT JOIN tags tag
        ON tag.id = course_tag.tag_id
      ${whereSql}
      GROUP BY
        c.id,
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
      ORDER BY ${orderBy}
    `,
    params
  };
}

async function getPopularCourseIds() {
  const [popularRows] = await db.query(
    `
      SELECT
        c.id,
        COUNT(e.id) AS enrollmentsCount
      FROM courses c
      LEFT JOIN enrollments e
        ON e.course_id = c.id
      GROUP BY c.id
      HAVING COUNT(e.id) > 0
      ORDER BY enrollmentsCount DESC, c.id ASC
      LIMIT ?
    `,
    [POPULAR_COURSE_LIMIT]
  );

  const selectedIds = popularRows.map((row) => row.id);

  if (selectedIds.length >= MIN_POPULAR_COURSE_RESULTS) {
    return selectedIds;
  }

  const excludedIds = selectedIds.length > 0 ? selectedIds : [0];
  const placeholders = excludedIds.map(() => "?").join(", ");
  const missingCount = POPULAR_COURSE_LIMIT - selectedIds.length;
  const [fallbackRows] = await db.query(
    `
      SELECT c.id
      FROM courses c
      WHERE c.id NOT IN (${placeholders})
      ORDER BY c.id ASC
      LIMIT ?
    `,
    [...excludedIds, missingCount]
  );

  return selectedIds.concat(fallbackRows.map((row) => row.id));
}

async function getCoursesByIds(courseIds) {
  if (courseIds.length === 0) {
    return [];
  }

  const placeholders = courseIds.map(() => "?").join(", ");
  const query = buildCourseSelectQuery({
    whereClauses: [`c.id IN (${placeholders})`],
    params: courseIds,
    orderBy: `FIELD(c.id, ${placeholders})`
  });
  const [rows] = await db.query(query.sql, [...query.params, ...courseIds]);

  return rows.map(mapCourseRow);
}

async function getCourseById(courseId) {
  const query = buildCourseSelectQuery({
    whereClauses: ["c.id = ?"],
    params: [courseId]
  });
  const [rows] = await db.query(query.sql, query.params);

  return rows.length > 0 ? mapCourseRow(rows[0]) : null;
}

async function getCourseOutcomes(courseId) {
  const [rows] = await db.query(
    `
      SELECT outcome_text
      FROM course_outcomes
      WHERE course_id = ?
      ORDER BY display_order ASC, id ASC
    `,
    [courseId]
  );

  return rows.map((row) => row.outcome_text);
}

async function getCourseLessons(courseId) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        course_id AS courseId,
        title,
        description,
        duration,
        video_url AS videoUrl,
        display_order AS displayOrder
      FROM lessons
      WHERE course_id = ?
      ORDER BY display_order ASC, id ASC
    `,
    [courseId]
  );

  return rows;
}

async function getUserEnrollmentForCourse(userId, courseId) {
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

  if (rows.length === 0) {
    return null;
  }

  const enrollment = rows[0];

  return {
    id: enrollment.id,
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    progress: enrollment.progress,
    isCompleted: enrollment.progress === 100,
    enrolledAt: enrollment.enrolledAt
  };
}

function mapCourseRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    level: row.level,
    requiredPlan: row.requiredPlan,
    image: row.image,
    tags: row.tags === "" ? [] : row.tags.split("|||"),
    isPopular: Boolean(row.isPopular),
    instructor: row.instructor,
    durationHours: row.durationHours,
    lessonsCount: row.lessonsCount
  };
}

exports.getCourses = async (req, res) => {
  const filters = buildCourseListFilters(req.query);
  const whereClauses = [];
  const params = [];

  if (filters.category !== "") {
    whereClauses.push("LOWER(category.name) = LOWER(?)");
    params.push(filters.category);
  }

  if (filters.level !== "") {
    whereClauses.push("LOWER(c.level) = ?");
    params.push(filters.level);
  }

  if (filters.search !== "") {
    whereClauses.push(
      `(LOWER(c.title) LIKE LOWER(?) OR LOWER(c.short_description) LIKE LOWER(?) OR LOWER(c.description) LIKE LOWER(?) OR LOWER(c.instructor_name) LIKE LOWER(?))`
    );

    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (filters.tags.length > 0) {
    const tagPlaceholders = filters.tags.map(() => "?").join(", ");

    whereClauses.push(
      `EXISTS (
        SELECT 1
        FROM course_tags filter_course_tag
        INNER JOIN tags filter_tag
          ON filter_tag.id = filter_course_tag.tag_id
        WHERE filter_course_tag.course_id = c.id
          AND LOWER(filter_tag.name) IN (${tagPlaceholders})
      )`
    );

    params.push(...filters.tags.map((tag) => tag.toLowerCase()));
  }

  try {
    const query = buildCourseSelectQuery({ whereClauses, params });
    const [rows] = await db.query(query.sql, query.params);
    const courses = rows.map(mapCourseRow);

    return sendSuccess(res, 200, "Courses retrieved successfully", {
      courses,
      filters: {
        category: filters.category || null,
        level: filters.level || null,
        tags: filters.tags,
        search: filters.search || null
      }
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve courses");
  }
};

exports.getPopularCourses = async (req, res) => {
  try {
    const popularCourseIds = await getPopularCourseIds();
    const courses = await getCoursesByIds(popularCourseIds);

    return sendSuccess(res, 200, "Popular courses retrieved successfully", {
      courses
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve popular courses");
  }
};

exports.getCourseById = async (req, res) => {
  const courseId = normalizePositiveInteger(req.params.id);

  if (courseId == null) {
    return sendError(res, 400, "Course id must be a positive integer");
  }

  try {
    const course = await getCourseById(courseId);

    if (course == null) {
      return sendError(res, 404, "Course not found");
    }

    const [outcomes, lessons, enrollment] = await Promise.all([
      getCourseOutcomes(courseId),
      getCourseLessons(courseId),
      req.authUser != null
        ? getUserEnrollmentForCourse(req.authUser.id, courseId)
        : Promise.resolve(null)
    ]);

    return sendSuccess(res, 200, "Course retrieved successfully", {
      course,
      outcomes,
      lessons,
      enrollment
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve course");
  }
};
