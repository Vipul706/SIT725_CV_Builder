import { Router } from 'express'
import multer from 'multer'
import { getAIFeedback } from '../../controller/aiFeedback.controller.js'

// Store uploaded PDF in memory (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are accepted.'), false)
    }
  }
}).single('resume')

function aiFeedbackRoute (middlewares = []) {
  const route = Router()

  if (middlewares.length > 0) {
    route.use(...middlewares)
  }

  // POST /ai/feedback — analyze uploaded resume PDF (no auth required for now)
  route.post('/feedback', (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: err.code === 'LIMIT_FILE_SIZE' ? 'File too large. Max 10MB.' : err.message
        })
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message })
      }
      next()
    })
  }, getAIFeedback)

  return route
}

export { aiFeedbackRoute }