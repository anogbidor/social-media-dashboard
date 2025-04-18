import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [500, 'Post cannot exceed 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
          maxlength: 200,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

PostSchema.index({ content: 'text' })

PostSchema.virtual('commentCount').get(function () {
  return this.comments.length
})

export default mongoose.model('Post', PostSchema)
