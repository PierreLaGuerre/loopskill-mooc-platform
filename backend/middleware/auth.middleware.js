const jwt = require("jsonwebtoken");

const db = require("../config/db");
const { sendError } = require("../utils/http");

const JWT_SECRET = process.env.JWT_SECRET;

function getBearerToken(authHeader) {
  if (typeof authHeader !== "string" || authHeader.trim() === "") {
    return null;
  }

  const parts = authHeader.trim().split(/\s+/);

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (scheme.toLowerCase() !== "bearer" || typeof token !== "string" || token.trim() === "") {
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

async function authenticateRequest(req) {
  const token = getBearerToken(req.headers.authorization);

  if (!token) {
    return {
      token: null,
      authenticatedUser: null
    };
  }

  if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
    throw new Error("Authentication is not configured");
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const authenticatedUser = await getAuthenticatedUser(decoded.id);

  if (authenticatedUser == null) {
    const error = new Error("Authenticated user no longer exists");
    error.name = "MissingAuthenticatedUserError";
    throw error;
  }

  return {
    token,
    authenticatedUser
  };
}

function assignAuthentication(req, token, authenticatedUser) {
  req.auth = {
    token,
    userId: authenticatedUser.id,
    email: authenticatedUser.email,
    role: authenticatedUser.role
  };
  req.authUser = authenticatedUser;
}

exports.verifyToken = async (req, res, next) => {
  try {
    const { token, authenticatedUser } = await authenticateRequest(req);

    if (!token || authenticatedUser == null) {
      return sendError(res, 401, "A valid Bearer token is required");
    }

    assignAuthentication(req, token, authenticatedUser);
    next();
  } catch (error) {
    if (error.message === "Authentication is not configured") {
      return sendError(res, 500, "Authentication is not configured");
    }

    if (error.name === "MissingAuthenticatedUserError") {
      return sendError(res, 401, "Authenticated user no longer exists");
    }

    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired");
    }

    return sendError(res, 401, "Invalid token");
  }
};

exports.attachAuthUserIfPresent = async (req, res, next) => {
  try {
    const { token, authenticatedUser } = await authenticateRequest(req);

    if (token != null && authenticatedUser != null) {
      assignAuthentication(req, token, authenticatedUser);
    }

    next();
  } catch (error) {
    if (error.message === "Authentication is not configured") {
      return sendError(res, 500, "Authentication is not configured");
    }

    if (error.name === "MissingAuthenticatedUserError") {
      return sendError(res, 401, "Authenticated user no longer exists");
    }

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
