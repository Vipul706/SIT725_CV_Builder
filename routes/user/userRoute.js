import { Router } from 'express'

function userRoute (middlewares = []) {
  const route = Router()

  // apply middlewares only if present
  if (middlewares.length > 0) {
    route.use(...middlewares)
  }

  return route
}

export { userRoute }
