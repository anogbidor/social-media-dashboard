import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedComments: [{ type: mongoose.Schema.Types.ObjectId }],
})

// Add password comparison method
UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', UserSchema)
