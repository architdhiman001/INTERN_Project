const jwt = require('jsonwebtoken');
const JWT_SECRET = "your_secret_key_here"; // ⚠️ Consider moving this to an environment variable

function authMiddleware(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach only necessary user info to req.user
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email // optional
    };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;
