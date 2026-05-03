// model/registerTables.js
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function connectMongo () {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB Error:', error.message)
    process.exit(1)
  }
}

async function registerTables () {
  try {
    const modelPath = __dirname

    const folders = fs.readdirSync(modelPath)

    for (const folder of folders) {
      const folderPath = path.join(modelPath, folder)

      const isFolder = fs.statSync(folderPath).isDirectory()

      if (isFolder) {
        const files = fs.readdirSync(folderPath)

        for (const file of files) {
          if (file.includes('.table') && file.endsWith('.js')) {
            const fullPath = path.join(folderPath, file)
            const fileUrl = pathToFileURL(fullPath).href

            await import(fileUrl)

            console.log(`${folder}/${file} registered`)
          }
        }
      }
    }

    console.log('All tables registered')
  } catch (error) {
    console.log('Register Tables Error:', error.message)
  }
}

async function initDatabase () {
  await connectMongo()
  await registerTables()
}

export { initDatabase }
