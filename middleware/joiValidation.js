import Joi from 'joi'

function validate (schema) {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, {
        abortEarly: false, // show all errors
        allowUnknown: true // ignore extra fields
      })

      if (error) {
        const errors = error.details.map(err => err.message)

        return res.status(400).json({
          success: false,
          errors
        })
      }

      next()
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Validation middleware error'
      })
    }
  }
}

export { validate }
