import { Router } from 'express'
import { userSignUp } from '../../controller/user.controller.js'
import { userSignUpSchema } from '../../middleware/schema/userRegistration.js'
import { validate } from '../../middleware/joiValidation.js'

function userRoute (middlewares = []) {
  const route = Router()

  // apply middlewares only if present
  if (middlewares.length > 0) {
    route.use(...middlewares)
  }

  route.post('/UserRegister', validate(userSignUpSchema), userSignUp)

  return route
}

export { userRoute }
