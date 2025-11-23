import express from 'express'

const app = express()

app.get('/health', (req, res) => {
  res.json({ message: 'Hello there!' })
})

export default app
