import { userRoute } from './user/userRoute.js'

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
