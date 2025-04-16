import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Import typeDefs and resolvers properly
import { typeDefs } from './typeDefs.js' // Changed from .graphql to .js
import { resolvers } from './resolvers.js'

// ES Modules equivalent for __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

// DB Connection
console.log('Connecting to MongoDB...')
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ Connection failed:', err.message)
    process.exit(1)
  })

// Express Setup
const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

// Health Check
app.get('/health', (req, res) => res.send('OK'))

const startServer = async () => {
  const apolloServer = new ApolloServer({
    typeDefs, // Now using the imported typeDefs
    resolvers,
    context: ({ req }) => ({ req }),
  })

  await apolloServer.start()
  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // CORS is already handled by express middleware
  })

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    console.log(
      `GraphQL at http://localhost:${port}${apolloServer.graphqlPath}`
    )
  })
}

startServer().catch((err) => console.error('Server startup failed:', err))
