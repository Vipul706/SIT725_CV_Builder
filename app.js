import express from 'express'
import dotenv from 'dotenv'
import { startServer } from './routes/routes.js'
dotenv.config()

const app = express()

startServer(app)
