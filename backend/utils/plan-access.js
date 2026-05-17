function normalizePlanId(value) {
  const parsedValue = Number(value);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return null;
}

function canAccessRequiredPlan(userPlanId, requiredPlanId) {
  const normalizedRequiredPlanId = normalizePlanId(requiredPlanId);

  if (normalizedRequiredPlanId == null) {
    return true;
  }

  const normalizedUserPlanId = normalizePlanId(userPlanId);

  if (normalizedUserPlanId == null) {
    return false;
  }

  return normalizedUserPlanId >= normalizedRequiredPlanId;
}

function buildCourseAccess(user, course) {
  const requiredPlanId = normalizePlanId(course?.requiredPlanId);
  const userPlanId = normalizePlanId(user?.plan_id ?? user?.planId);
  const hasPlanAccess = canAccessRequiredPlan(userPlanId, requiredPlanId);
  const hasPurchasedCourse = Boolean(course?.hasPurchasedCourse);
  const hasAccess = hasPlanAccess || hasPurchasedCourse;
  const isAuthenticated = user != null;

  return {
    hasAccess,
    hasPlanAccess,
    hasPurchasedCourse,
    isAuthenticated,
    requiresAuthentication: isAuthenticated === false && hasAccess === false,
    requiresUpgrade: isAuthenticated && hasAccess === false,
    requiresPayment: isAuthenticated && hasAccess === false,
    currentPlanId: userPlanId,
    requiredPlanId,
    requiredPlan: course?.requiredPlan ?? null
  };
}

module.exports = {
  buildCourseAccess,
  canAccessRequiredPlan,
  normalizePlanId
};
