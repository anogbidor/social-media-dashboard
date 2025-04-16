require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express')

// 1. Add connection logging
console.log('Attempting to connect to MongoDB...')
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1) // Exit if DB connection fails
  })

// 2. Verify env variables are loaded
console.log('Environment Variables:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'exists' : 'MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'MISSING',
})

// 3. Add basic health check route
const app = express()
app.get('/health', (req, res) => res.send('OK'))

// 4. Add server startup logging
const port = process.env.PORT || 4000
app
  .listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`)
  })
  .on('error', (err) => {
    console.error('Server failed to start:', err.message)
  })
