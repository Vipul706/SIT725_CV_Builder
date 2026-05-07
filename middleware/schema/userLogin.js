import Joi from 'joi'

const userLoginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format'
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  })
})

export { userLoginSchema }