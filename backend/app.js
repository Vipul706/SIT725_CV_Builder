import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { startServer } from './routes/routes.js'
dotenv.config()

const app = express()

app.use(cors())

startServer(app)