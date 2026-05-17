// models/File.js
import mongoose from 'mongoose'

const fileSchema = new mongoose.Schema(
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

    fileUrl: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      enum: ['pdf'],
      default: 'pdf'
    }
  },
  { timestamps: true }
)

const File = mongoose.model('File', fileSchema)
export { File }
