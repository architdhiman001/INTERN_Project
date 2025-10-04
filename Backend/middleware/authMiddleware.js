const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_secret_key_here";

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // attach user data to request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
