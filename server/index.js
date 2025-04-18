import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import path from 'path'
import { fileURLToPath } from 'url'
import { typeDefs } from './typeDefs.js'
import { resolvers } from './resolvers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ Connection failed:', err.message)
    process.exit(1)
  })

const app = express()
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(express.json())

//Test
app.get('/test', (req, res) => {
  res.send('✅ Express is alive')
})

app.get('/health', (req, res) => res.send('OK'))

const startServer = async () => {
  try {
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.replace('Bearer ', '')

        if (!token) return {}

        try {
          const user = jwt.verify(token, process.env.JWT_SECRET)
          return { user }
        } catch (error) {
          console.error('JWT Error:', error.message)
          return {}
        }
      },
    })

    await apolloServer.start()
    console.log('✅ ApolloServer started') // 👈 add this log

    apolloServer.applyMiddleware({
      app,
      path: '/graphql',
      cors: false,
    })

    const port = process.env.PORT || 4000
    const host = '0.0.0.0'

    app.listen(port, host, () => {
      console.log(`🚀 Server running on http://${host}:${port}`)
      console.log(
        `🔗 GraphQL available at http://${host}:${port}${apolloServer.graphqlPath}`
      )
    })
  } catch (err) {
    console.error('❌ Apollo Server startup failed:', err)
  }
}

startServer().catch((err) => console.error('Server startup failed:', err))
