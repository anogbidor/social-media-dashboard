import { gql } from 'apollo-server-express'

 export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    posts: [Post]
  }

  type Post {
    _id: ID!
    content: String!
    author: User!
    likes: Int
    comments: [Comment]
  }

  type Comment {
    _id: ID!
    text: String!
    author: User!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    posts: [Post]
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addPost(content: String!): Post
  }
`


