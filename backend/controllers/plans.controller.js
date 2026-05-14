const { sendError, sendSuccess } = require("../utils/http");
const { getPlansWithFeatures } = require("../utils/plan-catalog");

exports.getPlans = async (req, res) => {
  try {
    const plans = await getPlansWithFeatures();

    return sendSuccess(res, 200, "Plans retrieved successfully", {
      plans
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve plans");
  }
};
