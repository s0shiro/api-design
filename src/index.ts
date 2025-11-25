import app from './server.ts'
import { env } from '../env.ts'

const PORT = process.env.PORT || 3000

app.listen(env.PORT, () => {
  console.log(`API listening on port ${PORT}`)
})
