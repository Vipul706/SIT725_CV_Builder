import jwt from 'jsonwebtoken'
import { AuthToken } from '../model/authToken/authToken.table.js'

// ─── Auth Middleware ───────────────────────────────────────────────────────
// Verifies JWT from Authorization header and checks token is not blacklisted.
// Attach to any route that requires the user to be logged in.

async function authenticate (req, res, next) {
  try {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const token = authHeader.split(' ')[1]

    // Verify JWT signature and expiry
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      })
    }

    // Check if token has been blacklisted (i.e. user already logged out)
    const blacklisted = await AuthToken.findOne({ token })
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated. Please log in again.'
      })
    }

    // Attach decoded user info for downstream controllers
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message
    })
  }
}

export { authenticate }