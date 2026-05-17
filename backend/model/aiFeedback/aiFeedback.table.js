// models/AIFeedback.js
import mongoose from 'mongoose'

const aiFeedbackSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },

    contentScore: { type: Number, min: 0, max: 100, required: true },
    structureScore: { type: Number, min: 0, max: 100, required: true },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    overallScore: { type: Number, min: 0, max: 100, required: true },

    suggestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
)

const AIFeedback = mongoose.model('AIFeedback', aiFeedbackSchema)
export { AIFeedback }
