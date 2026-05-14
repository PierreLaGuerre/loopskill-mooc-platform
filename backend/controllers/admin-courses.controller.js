const db = require("../config/db");
const { sendError, sendSuccess } = require("../utils/http");
const { isDuplicateEntryError } = require("../utils/db-errors");

const COURSE_LEVELS = ["beginner", "intermediate", "advanced"];
const TITLE_MAX_LENGTH = 200;
const SLUG_MAX_LENGTH = 220;
const SHORT_DESCRIPTION_MAX_LENGTH = 255;
const IMAGE_MAX_LENGTH = 255;
const INSTRUCTOR_MAX_LENGTH = 150;

function normalizePositiveInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function normalizeNonNegativeInteger(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue >= 0) {
    return parsedValue;
  }

  return null;
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLevel(value) {
  const normalizedValue = normalizeText(value).toLowerCase();

  if (COURSE_LEVELS.includes(normalizedValue)) {
    return normalizedValue;
  }

  return null;
}

function slugify(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCoursePayload(body) {
  const title = normalizeText(body.title);
  const slug = slugify(body.slug || title);
  const shortDescription = normalizeText(body.shortDescription ?? body.short_description);
  const description = normalizeText(body.description);
  const level = normalizeLevel(body.level);
  const categoryId = normalizePositiveInteger(body.categoryId ?? body.category_id);
  const requiredPlanId = normalizePositiveInteger(body.requiredPlanId ?? body.required_plan_id);
  const image = normalizeText(body.image ?? body.coverImage ?? body.cover_image);
  const instructor = normalizeText(body.instructor ?? body.instructorName ?? body.instructor_name);
  const durationHours = normalizeNonNegativeInteger(body.durationHours ?? body.duration_hours);
  const lessonsCount = normalizeNonNegativeInteger(body.lessonsCount ?? body.lessons_count);

  return {
    title,
    slug,
    shortDescription,
    description,
    level,
    categoryId,
    requiredPlanId,
    image,
    instructor,
    durationHours,
    lessonsCount
  };
}

function addValidationError(errors, field, message) {
  if (errors[field] == null) {
    errors[field] = message;
  }
}

function validateCoursePayload(course) {
  const errors = {};

  if (course.title === "") {
    addValidationError(errors, "title", "Title is required");
  } else if (course.title.length > TITLE_MAX_LENGTH) {
    addValidationError(errors, "title", `Title must be ${TITLE_MAX_LENGTH} characters or fewer`);
  }

  if (course.slug === "") {
    addValidationError(errors, "slug", "Slug is required");
  } else if (course.slug.length > SLUG_MAX_LENGTH) {
    addValidationError(errors, "slug", `Slug must be ${SLUG_MAX_LENGTH} characters or fewer`);
  }

  if (course.shortDescription === "") {
    addValidationError(errors, "shortDescription", "Short description is required");
  } else if (course.shortDescription.length > SHORT_DESCRIPTION_MAX_LENGTH) {
    addValidationError(
      errors,
      "shortDescription",
      `Short description must be ${SHORT_DESCRIPTION_MAX_LENGTH} characters or fewer`
    );
  }

  if (course.level == null) {
    addValidationError(errors, "level", "Level must be beginner, intermediate or advanced");
  }

  if (course.categoryId == null) {
    addValidationError(errors, "categoryId", "Category id must be a positive integer");
  }

  if (course.requiredPlanId == null) {
    addValidationError(errors, "requiredPlanId", "Required plan id must be a positive integer");
  }

  if (course.image !== "" && course.image.length > IMAGE_MAX_LENGTH) {
    addValidationError(errors, "image", `Image must be ${IMAGE_MAX_LENGTH} characters or fewer`);
  }

  if (course.instructor === "") {
    addValidationError(errors, "instructor", "Instructor is required");
  } else if (course.instructor.length > INSTRUCTOR_MAX_LENGTH) {
    addValidationError(
      errors,
      "instructor",
      `Instructor must be ${INSTRUCTOR_MAX_LENGTH} characters or fewer`
    );
  }

  if (course.durationHours == null) {
    addValidationError(errors, "durationHours", "Duration hours must be a non-negative integer");
  }

  if (course.lessonsCount == null) {
    addValidationError(errors, "lessonsCount", "Lessons count must be a non-negative integer");
  }

  return errors;
}

function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}

async function entityExists(tableName, id) {
  const [rows] = await db.query(
    `SELECT id FROM ${tableName} WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows.length > 0;
}

async function validateCourseRelations(course) {
  const errors = {};
  const [categoryExists, planExists] = await Promise.all([
    entityExists("categories", course.categoryId),
    entityExists("plans", course.requiredPlanId)
  ]);

  if (categoryExists === false) {
    addValidationError(errors, "categoryId", "Category not found");
  }

  if (planExists === false) {
    addValidationError(errors, "requiredPlanId", "Required plan not found");
  }

  return errors;
}

function sendDuplicateSlugError(res) {
  return sendError(res, 409, "Course slug already exists", {
    slug: "A course with this slug already exists"
  });
}

async function hasEnrollments(courseId) {
  const [rows] = await db.query(
    "SELECT id FROM enrollments WHERE course_id = ? LIMIT 1",
    [courseId]
  );

  return rows.length > 0;
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

exports.createAdminCourse = async (req, res) => {
  const course = normalizeCoursePayload(req.body);
  const validationErrors = validateCoursePayload(course);

  if (hasValidationErrors(validationErrors)) {
    return sendError(res, 400, "Validation failed", validationErrors);
  }

  try {
    const relationErrors = await validateCourseRelations(course);

    if (hasValidationErrors(relationErrors)) {
      return sendError(res, 400, "Validation failed", relationErrors);
    }

    const [insertResult] = await db.query(
      `INSERT INTO courses (
         title,
         slug,
         short_description,
         description,
         level,
         category_id,
         required_plan_id,
         cover_image,
         duration_hours,
         lessons_count,
         instructor_name
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course.title,
        course.slug,
        course.shortDescription,
        course.description || null,
        course.level,
        course.categoryId,
        course.requiredPlanId,
        course.image || null,
        course.durationHours,
        course.lessonsCount,
        course.instructor
      ]
    );

    const query = buildAdminCoursesQuery({
      whereClauses: ["c.id = ?"],
      params: [insertResult.insertId]
    });
    const [rows] = await db.query(query.sql, query.params);

    return sendSuccess(res, 201, "Course created successfully", {
      course: mapAdminCourseRow(rows[0])
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return sendDuplicateSlugError(res);
    }

    return sendError(res, 500, "Could not create course");
  }
};

exports.updateAdminCourse = async (req, res) => {
  const courseId = normalizePositiveInteger(req.params.id);

  if (courseId == null) {
    return sendError(res, 400, "Course id must be a positive integer");
  }

  const course = normalizeCoursePayload(req.body);
  const validationErrors = validateCoursePayload(course);

  if (hasValidationErrors(validationErrors)) {
    return sendError(res, 400, "Validation failed", validationErrors);
  }

  try {
    const query = buildAdminCoursesQuery({
      whereClauses: ["c.id = ?"],
      params: [courseId]
    });
    const [existingRows] = await db.query(query.sql, query.params);

    if (existingRows.length === 0) {
      return sendError(res, 404, "Course not found");
    }

    const relationErrors = await validateCourseRelations(course);

    if (hasValidationErrors(relationErrors)) {
      return sendError(res, 400, "Validation failed", relationErrors);
    }

    await db.query(
      `UPDATE courses
       SET
         title = ?,
         slug = ?,
         short_description = ?,
         description = ?,
         level = ?,
         category_id = ?,
         required_plan_id = ?,
         cover_image = ?,
         duration_hours = ?,
         lessons_count = ?,
         instructor_name = ?
       WHERE id = ?`,
      [
        course.title,
        course.slug,
        course.shortDescription,
        course.description || null,
        course.level,
        course.categoryId,
        course.requiredPlanId,
        course.image || null,
        course.durationHours,
        course.lessonsCount,
        course.instructor,
        courseId
      ]
    );

    const [updatedRows] = await db.query(query.sql, query.params);

    return sendSuccess(res, 200, "Course updated successfully", {
      course: mapAdminCourseRow(updatedRows[0])
    });
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      return sendDuplicateSlugError(res);
    }

    return sendError(res, 500, "Could not update course");
  }
};

exports.deleteAdminCourse = async (req, res) => {
  const courseId = normalizePositiveInteger(req.params.id);

  if (courseId == null) {
    return sendError(res, 400, "Course id must be a positive integer");
  }

  try {
    if (await hasEnrollments(courseId)) {
      return sendError(res, 409, "Course cannot be deleted while it has enrollments", {
        courseId: "Remove related enrollments before deleting this course"
      });
    }

    const [result] = await db.query(
      "DELETE FROM courses WHERE id = ?",
      [courseId]
    );

    if (result.affectedRows === 0) {
      return sendError(res, 404, "Course not found");
    }

    return sendSuccess(res, 200, "Course deleted successfully", {
      courseId
    });
  } catch (error) {
    return sendError(res, 500, "Could not delete course");
  }
};
