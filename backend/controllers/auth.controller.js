const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER

exports.register = async (req, res) => {
  const { name, email, password, client_type } = req.body;

  try {

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query("INSERT INTO users (name, email, password, client_type, role, plan_id) VALUES (?, ?, ?, ?, 'student', 1)", [name, email, hashedPassword, client_type], (err, result) => {
          if (err) return res.status(500).json(err);

          res.json({ message: "User created successfully" });
        }
      );
    });

  } catch (error) {
    res.status(500).json(error);
  }
};



// LOGIN

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      "secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
};