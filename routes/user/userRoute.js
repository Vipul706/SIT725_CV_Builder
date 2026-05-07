import { Router } from 'express'
import { userSignUp, userLogin } from '../../controller/user.controller.js'
import { userSignUpSchema } from '../../middleware/schema/userRegistration.js'
import { userLoginSchema } from '../../middleware/schema/userLogin.js'
import { validate } from '../../middleware/joiValidation.js'

function userRoute (middlewares = []) {
  const route = Router()

  // apply middlewares only if present
  if (middlewares.length > 0) {
    route.use(...middlewares)
  }

  // US1 – User Registration
  route.post('/UserRegister', validate(userSignUpSchema), userSignUp)

  // US2 – User Login
  route.post('/UserLogin', validate(userLoginSchema), userLogin)

  return route
}

export { userRoute }