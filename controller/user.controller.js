import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../model/user/user.table.js'

// ─── US1: User Registration ────────────────────────────────────────────────
const userSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash
    })

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
}

// ─── US2: User Login ───────────────────────────────────────────────────────
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Compare submitted password against stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Sign JWT — payload carries id, email, role; expires in 1 day
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error.',
      error: error.message
    })
  }
}

export { userSignUp, userLogin }