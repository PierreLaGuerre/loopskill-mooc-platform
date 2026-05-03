const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");

const DEFAULT_COURSE_ORDER = "c.id ASC";
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
