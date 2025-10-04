const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../model/User');
const router = express.Router();

const JWT_SECRET = "your_secret_key_here"; // use .env later

// ✅ Signup route
router.post('/signup', async (req, res) => {
  const db = req.app.locals.db;
  const users = new UserModel(db);
  const { name, email, password } = req.body;

  try {
    const existing = await users.findByEmail(email);
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = await users.createUser(name, email, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const db = req.app.locals.db;
  const users = new UserModel(db);
  const { email, password } = req.body;

  try {
    const user = await users.findByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
