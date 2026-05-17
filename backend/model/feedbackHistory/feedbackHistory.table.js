// models/FeedbackHistory.js
import mongoose from 'mongoose'

const feedbackHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },

    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIFeedback',
      required: true
    }
  },
  { timestamps: true }
)

const FeedbackHistory = mongoose.model('FeedbackHistory', feedbackHistorySchema)
export { FeedbackHistory }
