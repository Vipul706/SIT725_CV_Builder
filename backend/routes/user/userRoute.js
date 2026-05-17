import { Router } from 'express'
import { userSignUp, userLogin, userLogout } from '../../controller/user.controller.js'
import { userSignUpSchema } from '../../middleware/schema/userRegistration.js'
import { userLoginSchema } from '../../middleware/schema/userLogin.js'
import { validate } from '../../middleware/joiValidation.js'
import { authenticate } from '../../middleware/authenticate.js'

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

  // US3 – User Logout (authenticate runs first to verify and protect the route)
  route.post('/UserLogout', authenticate, userLogout)

  return route
}

export { userRoute }