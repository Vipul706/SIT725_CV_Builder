// models/AuthToken.js
import mongoose from 'mongoose'

const authTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    token: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

const AuthToken = mongoose.model('AuthToken', authTokenSchema)
export { AuthToken }
