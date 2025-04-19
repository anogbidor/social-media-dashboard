import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [Post]
    savedPosts: [Post]
  }

  type Post {
    _id: ID!
    content: String!
    author: User!
    likes: Int
    comments: [Comment]
    savedBy: [User]
    createdAt: String
  }

  type Comment {
    _id: ID!
    text: String!
    author: User!
    likes: Int
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Message {
    message: String!
  }

  type Query {
    me: User
    posts: [Post]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    register(username: String!, email: String!, password: String!): Auth

    addPost(content: String!): Post
    updatePost(postId: ID!, content: String!): Post
    deletePost(postId: ID!): Message

    addComment(postId: ID!, text: String!): Comment
    deleteComment(postId: ID!, commentId: ID!): Message
    likeComment(postId: ID!, commentId: ID!): Comment

    likePost(postId: ID!): Post
    savePost(postId: ID!): Post
    unsavePost(postId: ID!): Post
  }
`
