import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import z from 'zod'
import { validateBody } from '../middleware/validation.ts'
import { createHabitSchema } from '../openapi/schemas/habits.ts'

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch('/:id', updateHabit)

export default router
