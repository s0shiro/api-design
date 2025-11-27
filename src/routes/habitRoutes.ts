import { Router, type Request, type Response } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import z from 'zod'
import { validateBody } from '../middleware/validation.ts'

const router = Router()

router.use(authenticateToken)

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).default([]),
})

router.get('/', getUserHabits)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch('/:id', updateHabit)

export default router
