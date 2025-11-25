import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { isTest } from '../env.ts'

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

app.use('/api/auth', authRoutes)

export default app
