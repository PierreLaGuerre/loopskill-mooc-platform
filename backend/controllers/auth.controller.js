const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = 10;
const DEFAULT_USER_PLAN_ID = Number(process.env.DEFAULT_USER_PLAN_ID) || 1;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 150;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

const CLIENT_TYPE_MAP = {
  student: "student",
  professional: "professional",
  profesional: "professional",
  company: "company"
};

const INTEREST_ALIASES = {
  python: "Python",
  java: "Java",
  angular: "Angular",
  react: "React",
  sql: "SQL",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  mongodb: "MongoDB",
  aws: "AWS",
  azure: "Azure",
  docker: "Docker",
  kubernetes: "Kubernetes",
  git: "Git",
  github: "GitHub",
  "ci/cd": "CI/CD",
  linux: "Linux",
  "machine learning": "Machine Learning",
  pandas: "Pandas",
  numpy: "NumPy",
  "power bi": "Power BI",
  "data analysis": "Data Analysis",
  typescript: "TypeScript",
  oop: "OOP",
  "rest api": "REST API"
};

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

function normalizeClientType(value) {
  const normalizedValue = normalizeText(value).toLowerCase();
  return CLIENT_TYPE_MAP[normalizedValue] || null;
}

function normalizeInterestNames(interests) {
  if (Array.isArray(interests) === false) {
    return [];
  }

  const uniqueInterests = new Map();

  for (const interest of interests) {
    const normalizedInterest = normalizeText(interest).toLowerCase();

    if (normalizedInterest === "") {
      continue;
    }

    const mappedInterest = INTEREST_ALIASES[normalizedInterest] || normalizeText(interest);
    uniqueInterests.set(mappedInterest.toLowerCase(), mappedInterest);
  }

  return Array.from(uniqueInterests.values());
}

function buildToken(user) {
  if (typeof JWT_SECRET !== "string" || JWT_SECRET.trim() === "") {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function getUserById(userId) {
  const [rows] = await db.query(
    "SELECT id, name, email, role, client_type, plan_id FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  return rows[0] || null;
}

async function getUserInterests(userId) {
  const [rows] = await db.query(
    `SELECT t.name
     FROM user_interests ui
     INNER JOIN tags t ON t.id = ui.tag_id
     WHERE ui.user_id = ?
     ORDER BY t.name ASC`,
    [userId]
  );

  return rows.map((row) => row.name);
}

function sendError(res, statusCode, message, details) {
  const payload = {
    success: false,
    message
  };

  if (details != null) {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
}

function sendSuccess(res, statusCode, message, data) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function sendAuthSuccess(res, statusCode, message, user, token) {
  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user
  });
}

function validateRegisterInput({ name, email, password, clientType }) {
  const details = {};

  if (name === "") {
    details.name = "Name is required";
  } else if (name.length > NAME_MAX_LENGTH) {
    details.name = `Name must be ${NAME_MAX_LENGTH} characters or fewer`;
  }

  if (email === "") {
    details.email = "Email is required";
  } else if (email.length > EMAIL_MAX_LENGTH) {
    details.email = `Email must be ${EMAIL_MAX_LENGTH} characters or fewer`;
  } else if (isValidEmail(email) === false) {
    details.email = "Email format is invalid";
  }

  if (password === "") {
    details.password = "Password is required";
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    details.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    details.password = `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`;
  }

  if (clientType == null) {
    details.clientType = "Client type is invalid";
  }

  return details;
}

function validateLoginInput({ email, password }) {
  const details = {};

  if (email === "") {
    details.email = "Email is required";
  } else if (isValidEmail(email) === false) {
    details.email = "Email format is invalid";
  }

  if (password === "") {
    details.password = "Password is required";
  }

  return details;
}

async function getInterestRowsByNames(connection, interests) {
  if (interests.length === 0) {
    return [];
  }

  const placeholders = interests.map(() => "?").join(", ");
  const [rows] = await connection.query(
    `SELECT id, name FROM tags WHERE LOWER(name) IN (${placeholders})`,
    interests.map((interest) => interest.toLowerCase())
  );

  return rows;
}

function buildUserResponse(user, interests) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clientType: user.client_type,
    planId: user.plan_id,
    interests
  };
}

async function insertUserInterests(connection, userId, interests) {
  if (interests.length === 0) {
    return;
  }

  const tagRows = await getInterestRowsByNames(connection, interests);

  const valuesPlaceholders = tagRows.map(() => "(?, ?)").join(", ");
  const params = tagRows.flatMap((tagRow) => [userId, tagRow.id]);

  await connection.query(
    `INSERT INTO user_interests (user_id, tag_id) VALUES ${valuesPlaceholders}`,
    params
  );
}

exports.register = async (req, res) => {
  const name = normalizeText(req.body.name);
  const email = normalizeEmail(req.body.email);
  const password = normalizeText(req.body.password);
  const clientType = normalizeClientType(req.body.clientType ?? req.body.client_type);
  const interests = normalizeInterestNames(req.body.interests);
  const validationErrors = validateRegisterInput({ name, email, password, clientType });

  if (Object.keys(validationErrors).length > 0) {
    return sendError(res, 400, "Validation failed", validationErrors);
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existingUsers] = await connection.query(
      "SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    if (existingUsers.length > 0) {
      await connection.rollback();
      return sendError(res, 409, "Email already in use", {
        email: "An account with this email already exists"
      });
    }

    const tagRows = await getInterestRowsByNames(connection, interests);
    const matchedInterestNames = new Set(tagRows.map((tagRow) => tagRow.name.toLowerCase()));
    const invalidInterests = interests.filter(
      (interest) => matchedInterestNames.has(interest.toLowerCase()) === false
    );

    if (invalidInterests.length > 0) {
      await connection.rollback();
      return sendError(res, 400, "Validation failed", {
        interests: `Unknown interests: ${invalidInterests.join(", ")}`
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [insertResult] = await connection.query(
      `INSERT INTO users (name, email, password, role, client_type, plan_id)
       VALUES (?, ?, ?, 'student', ?, ?)`,
      [name, email, hashedPassword, clientType, DEFAULT_USER_PLAN_ID]
    );

    await insertUserInterests(connection, insertResult.insertId, interests);
    await connection.commit();

    const user = await getUserById(insertResult.insertId);
    const storedInterests = await getUserInterests(insertResult.insertId);
    const token = buildToken(user);

    return sendAuthSuccess(
      res,
      201,
      "User created successfully",
      buildUserResponse(user, storedInterests),
      token
    );
  } catch (error) {
    if (connection != null) {
      await connection.rollback();
    }

    return sendError(res, 500, "Could not register user");
  } finally {
    if (connection != null) {
      connection.release();
    }
  }
};

exports.login = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = normalizeText(req.body.password);
  const validationErrors = validateLoginInput({ email, password });

  if (Object.keys(validationErrors).length > 0) {
    return sendError(res, 400, "Validation failed", validationErrors);
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return sendError(res, 401, "Invalid credentials");
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword === false) {
      return sendError(res, 401, "Invalid credentials");
    }

    const interests = await getUserInterests(user.id);
    const token = buildToken(user);

    return sendAuthSuccess(
      res,
      200,
      "Login completed successfully",
      buildUserResponse(user, interests),
      token
    );
  } catch (error) {
    return sendError(res, 500, "Could not log in");
  }
};

exports.getSession = (req, res) => {
  return sendSuccess(res, 200, "Authenticated session retrieved successfully", {
    auth: req.auth
  });
};

exports.getMe = async (req, res) => {
  try {
    const interests = await getUserInterests(req.authUser.id);

    return sendSuccess(res, 200, "Authenticated user retrieved successfully", {
      user: buildUserResponse(req.authUser, interests)
    });
  } catch (error) {
    return sendError(res, 500, "Could not retrieve authenticated user");
  }
};

exports.getAdminAccess = (req, res) => {
  return sendSuccess(res, 200, "Admin access granted", {
    auth: req.auth
  });
};
