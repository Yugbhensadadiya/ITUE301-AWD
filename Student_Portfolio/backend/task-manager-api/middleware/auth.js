const jwt = require('jsonwebtoken');

/**
 * Practical 7: JWT Authentication Middleware
 * 
 * Objectives:
 * 1. Read 'Authorization' header from incoming HTTP request.
 * 2. Check for 'Bearer <token>' pattern.
 * 3. Verify JWT signature using secret key.
 * 4. Attach decoded user payload to req.user for downstream route access.
 * 5. Return HTTP 401 Unauthorized if token is missing, invalid, or expired.
 */
const auth = (req, res, next) => {
  // 1. Retrieve the Authorization header (case-insensitive via Express req.get)
  const authHeader = req.get('authorization') || req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Access denied. No authentication token provided.'
    });
  }

  // 2. Extract token from 'Bearer <token>' format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Invalid token format. Header must be "Bearer <token>".'
    });
  }

  const token = parts[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key_practical_7_supersecret';

  // 3. Verify token authenticity and expiration
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded user information (id, email) to request object
    req.user = decoded;
    next();
  } catch (err) {
    console.warn(`⚠️ [AUTH REJECTED] JWT Verification failed: ${err.message}`);
    return res.status(401).json({
      error: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = auth;
