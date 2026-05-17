// models/ResumeSection.js
import mongoose from 'mongoose'

const resumeSectionSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true
    },

    sectionType: {
      type: String,
      enum: [
        'personal_information',
        'professional_summary',
        'work_experience',
        'education',
        'skills',
        'projects'
      ],
      required: true
    },

    content: {
      type: Object,
      default: {}
    },

    orderIndex: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const ResumeSection = mongoose.model('ResumeSection', resumeSectionSchema)
export { ResumeSection }
