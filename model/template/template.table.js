// models/Template.js
import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: { type: String, trim: true },

    ejsFile: {
      type: String,
      required: true
      // example: "modern.ejs"
    },

    previewImage: {
      type: String
      // example: "/images/templates/modern.png"
    },

    layoutConfig: {
      type: Object,
      default: {}
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

const Template = mongoose.model('Template', templateSchema)
export { Template }
