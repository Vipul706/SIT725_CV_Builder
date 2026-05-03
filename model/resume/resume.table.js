// models/Resume.js
import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
)

const Resume = mongoose.model('Resume', resumeSchema)
export { Resume }
