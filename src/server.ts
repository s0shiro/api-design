import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'

// Import OpenAPI setup FIRST (extends Zod)
import './openapi/index.ts'
// Then import paths
import './openapi/paths/auth.ts'
import './openapi/paths/habits.ts'

import authRoutes from './routes/authRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import gemeniRoutes from './routes/gemeniRoutes.ts'
import { errorHandler } from './middleware/errorHandler.ts'
import docsRoutes from './routes/docsRoutes.ts'

const app = express()
app.use(helmet())
app.use(cors())
app.use(
  morgan('dev', {
    skip: () => isTest(),
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (req, res) => {
  res.json({ message: 'Hello there!' })
})

app.use('/docs', docsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/habit', habitRoutes)
app.use('/api/ai', gemeniRoutes)

app.use(errorHandler)

export default app
