import Joi from 'joi'

const userSignUpSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'First name is required'
  }),

  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Last name is required'
  }),

  email: Joi.string().trim().email().required().messages({
    'string.email': 'Invalid email format'
  }),

  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password must be at least 6 characters'
  })
})

export { userSignUpSchema }
