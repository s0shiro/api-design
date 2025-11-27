import { Router } from 'express'
import { aiInsights, askGemeni } from '../controllers/gemeniController.ts'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()

router.use(authenticateToken)

router.post('/ask', askGemeni)
router.post('/insights', aiInsights)

export default router
