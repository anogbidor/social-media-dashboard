const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  comments: [
    {
      text: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Post', PostSchema)
