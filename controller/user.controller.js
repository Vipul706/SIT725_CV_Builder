import bcrypt from 'bcrypt'
import { User } from '../model/user/user.table.js'

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

export { userSignUp }
