const db = require("../config/db");

function mapPlanRows(rows) {
  const plansById = new Map();

  for (const row of rows) {
    if (plansById.has(row.id) === false) {
      plansById.set(row.id, {
        id: row.id,
        name: row.name,
        price: Number(row.price),
        description: row.description,
        features: [],
        recommended: row.name === "Pro"
      });
    }

    if (row.featureText != null) {
      plansById.get(row.id).features.push(row.featureText);
    }
  }

  return Array.from(plansById.values());
}

async function getPlansWithFeatures() {
  const [rows] = await db.query(
    `
      SELECT
        p.id,
        p.name,
        p.price,
        p.description,
        pf.feature_text AS featureText
      FROM plans p
      LEFT JOIN plan_features pf
        ON pf.plan_id = p.id
      ORDER BY p.id ASC, pf.display_order ASC, pf.id ASC
    `
  );

  return mapPlanRows(rows);
}

module.exports = {
  getPlansWithFeatures,
  mapPlanRows
};
