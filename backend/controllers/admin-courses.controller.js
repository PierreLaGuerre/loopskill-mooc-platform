const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");

function normalizePositiveInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function mapAdminCourseRow(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.shortDescription,
    description: row.description,
    categoryId: row.categoryId,
    category: row.category,
    level: row.level,
    requiredPlanId: row.requiredPlanId,
    requiredPlan: row.requiredPlan,
    image: row.image,
    tags: row.tags === "" ? [] : row.tags.split("|||"),
    instructor: row.instructor,
    durationHours: row.durationHours,
    lessonsCount: row.lessonsCount,
    createdAt: row.createdAt
  };
}

function buildAdminCoursesQuery({ whereClauses = [], params = [] } = {}) {
  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  return {
    sql: `
      SELECT
        c.id,
        c.title,
        c.slug,
        c.short_description AS shortDescription,
        c.description,
        c.category_id AS categoryId,
        category.name AS category,
        c.level,
        c.required_plan_id AS requiredPlanId,
        plan.name AS requiredPlan,
        c.cover_image AS image,
        COALESCE(
          GROUP_CONCAT(DISTINCT tag.name ORDER BY tag.name ASC SEPARATOR "|||"),
          ""
        ) AS tags,
        c.instructor_name AS instructor,
        c.duration_hours AS durationHours,
        c.lessons_count AS lessonsCount,
        c.created_at AS createdAt
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
        c.slug,
        c.short_description,
        c.description,
        c.category_id,
        category.name,
        c.level,
        c.required_plan_id,
        plan.name,
        c.cover_image,
        c.instructor_name,
        c.duration_hours,
        c.lessons_count,
        c.created_at
      ORDER BY c.created_at DESC, c.id DESC
    `,
    params
  };
}

exports.getAdminCourses = async (req, res) => {
  try {
    const query = buildAdminCoursesQuery();
    const [rows] = await db.query(query.sql, query.params);
    const courses = rows.map(mapAdminCourseRow);

    return sendSuccess(res, 200, "Admin courses retrieved successfully", {
      courses
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve admin courses");
  }
};

exports.getAdminCourseById = async (req, res) => {
  const courseId = normalizePositiveInteger(req.params.id);

  if (courseId == null) {
    return sendError(res, 400, "Course id must be a positive integer");
  }

  try {
    const query = buildAdminCoursesQuery({
      whereClauses: ["c.id = ?"],
      params: [courseId]
    });
    const [rows] = await db.query(query.sql, query.params);

    if (rows.length === 0) {
      return sendError(res, 404, "Course not found");
    }

    return sendSuccess(res, 200, "Admin course retrieved successfully", {
      course: mapAdminCourseRow(rows[0])
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve admin course");
  }
};
