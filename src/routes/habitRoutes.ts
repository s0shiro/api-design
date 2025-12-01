import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'
import z from 'zod'
import { validateBody } from '../middleware/validation.ts'
import { habitSchema } from '../db/schema.ts'

const router = Router()

router.use(authenticateToken)

export const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).default([]),
})

const habitsParamsSchema = habitSchema.pick({ id: true })

export type CreateHabitBody = z.infer<typeof createHabitSchema>
export type HabitParams = z.infer<typeof habitsParamsSchema>

router.get('/', getUserHabits)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch('/:id', updateHabit)

export default router
