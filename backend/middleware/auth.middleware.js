const jwt = require("jsonwebtoken");

const db = require("../config/db");
const { sendError } = require("../utils/http");

const JWT_SECRET = process.env.JWT_SECRET;

function getBearerToken(authHeader) {
  if (typeof authHeader !== "string" || authHeader.trim() === "") {
    return null;
  }

  const [scheme, token] = authHeader.trim().split(/\s+/);

  if (scheme !== "Bearer" || typeof token !== "string" || token.trim() === "") {
    return null;
  }

  return token.trim();
}

async function getAuthenticatedUser(userId) {
  const [rows] = await db.query(
    "SELECT id, name, email, role, client_type, plan_id FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  return rows[0] || null;
}

exports.verifyToken = async (req, res, next) => {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return sendError(res, 401, "A valid Bearer token is required");
  }

  if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
    return sendError(res, 500, "Authentication is not configured");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const authenticatedUser = await getAuthenticatedUser(decoded.id);

    if (authenticatedUser == null) {
      return sendError(res, 401, "Authenticated user no longer exists");
    }

    req.auth = {
      token,
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      role: authenticatedUser.role
    };
    req.authUser = authenticatedUser;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired");
    }

    return sendError(res, 401, "Invalid token");
  }
};

exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const currentRole = req.auth?.role;

    if (currentRole == null) {
      return sendError(res, 401, "Authentication is required");
    }

    if (allowedRoles.includes(currentRole) === false) {
      return sendError(res, 403, "You do not have access to this resource");
    }

    next();
  };
};
