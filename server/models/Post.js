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
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true }, // Include virtuals when converted to JSON
    toObject: { virtuals: true },
  }
)

// Add text index for search functionality
PostSchema.index({ content: 'text' })

// Virtual for comment count
PostSchema.virtual('commentCount').get(function () {
  return this.comments.length
})

const Post = mongoose.model('Post', PostSchema)
export default Post
