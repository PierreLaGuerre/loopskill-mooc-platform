const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const SALT_ROUNDS = 10;

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

  const placeholders = interests.map(() => "?").join(", ");
  const [tagRows] = await connection.query(
    `SELECT id FROM tags WHERE LOWER(name) IN (${placeholders})`,
    interests.map((interest) => interest.toLowerCase())
  );

  if (tagRows.length === 0) {
    return;
  }

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

  if (name === "" || email === "" || password === "") {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  if (clientType == null) {
    return res.status(400).json({ message: "Invalid client type" });
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
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const [insertResult] = await connection.query(
      `INSERT INTO users (name, email, password, role, client_type, plan_id)
       VALUES (?, ?, ?, 'student', ?, 1)`,
      [name, email, hashedPassword, clientType]
    );

    await insertUserInterests(connection, insertResult.insertId, interests);
    await connection.commit();

    const user = await getUserById(insertResult.insertId);
    const storedInterests = await getUserInterests(insertResult.insertId);
    const token = buildToken(user);

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: buildUserResponse(user, storedInterests)
    });
  } catch (error) {
    if (connection != null) {
      await connection.rollback();
    }

    return res.status(500).json({
      message: "Could not register user",
      error: error.message
    });
  } finally {
    if (connection != null) {
      connection.release();
    }
  }
};

exports.login = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = normalizeText(req.body.password);

  if (email === "" || password === "") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword === false) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const interests = await getUserInterests(user.id);
    const token = buildToken(user);

    return res.json({
      token,
      user: buildUserResponse(user, interests)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not log in",
      error: error.message
    });
  }
};
