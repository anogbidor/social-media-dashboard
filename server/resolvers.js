import { AuthenticationError } from 'apollo-server-express'
import User from './models/User.js'
import Post from './models/Post.js'
import { signToken, hashPassword } from './utils/auth.js'

export const resolvers = {
  Query: {
    me: async (_, __, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')
      return User.findById(context.user.id).populate('posts')
    },
    posts: async () =>
      Post.find().populate('author').populate('comments.author'),
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

    register: async (_, { username, email, password }) => {
      const existing = await User.findOne({ email })
      if (existing) throw new AuthenticationError('Email already exists')

      const hashed = await hashPassword(password)
      const user = await User.create({ username, email, password: hashed })
      const token = signToken(user)
      return { token, user }
    },

    addPost: async (_, { content }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')

      const post = await Post.create({ content, author: context.user.id })
      await User.findByIdAndUpdate(context.user.id, {
        $push: { posts: post._id },
      })
      return post
    },

    updatePost: async (_, { postId, content }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')

      const post = await Post.findById(postId)
      if (!post || post.author.toString() !== context.user.id) {
        throw new AuthenticationError('Not authorized')
      }

      post.content = content
      await post.save()
      return post
    },

    deletePost: async (_, { postId }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')

      const post = await Post.findById(postId)
      if (!post || post.author.toString() !== context.user.id) {
        throw new AuthenticationError('Not authorized')
      }

      await Post.findByIdAndDelete(postId)
      await User.findByIdAndUpdate(context.user.id, {
        $pull: { posts: postId },
      })
      return { message: 'Post deleted successfully' }
    },

    addComment: async (_, { postId, text }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')

      const comment = {
        text,
        author: context.user.id,
        createdAt: new Date(),
      }

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
      ).populate('comments.author')

      return updatedPost.comments.at(-1)
    },

    deleteComment: async (_, { postId, commentId }, context) => {
      if (!context.user) throw new AuthenticationError('Not logged in')

      const post = await Post.findById(postId)
      if (!post) throw new Error('Post not found')

      const comment = post.comments.id(commentId)
      if (!comment || comment.author.toString() !== context.user.id) {
        throw new AuthenticationError('Not authorized')
      }

      comment.remove()
      await post.save()
      return { message: 'Comment deleted successfully' }
    },
  },
}
