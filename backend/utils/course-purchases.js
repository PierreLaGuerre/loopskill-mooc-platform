const db = require("../config/db");

async function hasPurchasedCourse(userId, courseId) {
  if (userId == null || courseId == null) {
    return false;
  }

  const [rows] = await db.query(
    `
      SELECT id
      FROM course_purchases
      WHERE user_id = ? AND course_id = ?
      LIMIT 1
    `,
    [userId, courseId]
  );

  return rows.length > 0;
}

module.exports = {
  hasPurchasedCourse
};
