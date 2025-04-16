import { AuthenticationError } from 'apollo-server-express'
import User from './models/User.js'
import Post from './models/Post.js'
import { signToken } from './utils/auth.js'

 export const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')
      return User.findById(context.user._id).populate('posts')
    },
    posts: async () => Post.find().populate('author'),
  },
  Mutation: {
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) throw new AuthenticationError('Invalid credentials')
      const correctPw = await user.isCorrectPassword(password)
      if (!correctPw) throw new AuthenticationError('Invalid credentials')
      const token = signToken(user)
      return { token, user }
    },
    addPost: async (_, { content }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')
      const post = await Post.create({ content, author: context.user._id })
      await User.findByIdAndUpdate(context.user._id, {
        $push: { posts: post._id },
      })
      return post
    },
  },
}


