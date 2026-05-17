import express from 'express'
import { userRoute } from './user/userRoute.js'
import { initDatabase } from '../model/registerTables.js'

const routePaths = [
  {
    routepath: '/',
    router: userRoute,
    middlewares: []
  }
]

async function startServer (app) {
  try {
    const port = process.env.PORT || 3000
    await initDatabase()

    // Required: parse incoming JSON request bodies
    app.use(express.json())

    for (const routes of routePaths) {
      const router = routes.router(routes.middlewares)

      if (router) {
        app.use(routes.routepath, router)
      }
    }

    app.listen(port, () => {
      console.log(`server running on port ${port}`)
    })
  } catch (error) {
    console.log('Server Error', error)
  }
}

export { startServer }