import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import db from '../db/connection.ts'
import { habits, habitTags } from '../db/schema.ts'
import { and, desc, eq } from 'drizzle-orm'
import type {
  AuthenticatedRequestBody,
  TypedRequest,
} from '../types/express.ts'
import type {
  CreateHabitInput,
  HabitParams,
  UpdateHabitInput,
} from '../openapi/schemas/habits.ts'

export const createHabit = async (
  req: TypedRequest<CreateHabitInput>,
  res: Response,
) => {
  try {
    const { name, description, frequency, targetCount, tagIds } = req.body

    const result = await db.transaction(async (tx) => {
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId: req.user.id,
          name,
          description,
          frequency,
          targetCount,
        })
        .returning()

      if (tagIds && tagIds.length > 0) {
        const habitTagValues = tagIds.map((tagId) => ({
          habitId: newHabit.id,
          tagId,
        }))

        await tx.insert(habitTags).values(habitTagValues)
      }

      return newHabit
    })

    res.status(201).json({
      message: 'New habit created',
      habit: result,
    })
  } catch (error) {
    console.error('Create habit error', error)
    res.status(500).json({ error: 'Failed to create habit.' })
  }
}

export const getUserHabits = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userHabitsWithTags = await db.query.habits.findMany({
      where: eq(habits.userId, req.user.id),
      with: {
        habitTags: {
          with: {
            tag: true,
          },
        },
      },
      orderBy: [desc(habits.createdAt)],
    })

    //transform the data
    const habitsWithTags = userHabitsWithTags.map(
      ({ habitTags, ...habit }) => ({
        ...habit,
        tags: habitTags.map((ht) => ht.tag),
      }),
    )

    res.status(201).json({
      habits: habitsWithTags,
    })
  } catch (error) {
    console.error('Getting user habits error ', error)
    res.status(500).json({ error: 'Fatal error, failed to get user habits' })
  }
}

export const updateHabit = async (
  req: TypedRequest<Partial<UpdateHabitInput>, HabitParams>,
  res: Response,
) => {
  try {
    const { id } = req.params
    const userId = req.user.id
    const { tagIds, ...updates } = req.body

    const result = await db.transaction(async (tx) => {
      //update the habit
      const [updatedHabit] = await tx
        .update(habits)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(habits.id, id), eq(habits.userId, userId)))
        .returning()

      if (!updatedHabit) {
        return res.status(401).end()
      }

      if (tagIds !== undefined) {
        //remove the existing habit tags
        await tx.delete(habitTags).where(eq(habitTags.habitId, id))
        if (tagIds && tagIds.length > 0) {
          const habitTagValues = tagIds.map((tagId: string) => ({
            habitId: id,
            tagId,
          }))
          await tx.insert(habitTags).values(habitTagValues)
        }
      }

      return updatedHabit
    })

    res.json({
      message: 'Habit updated successfully',
      habit: result,
    })
  } catch (error) {
    if (error.message === 'Habit not found') {
      return res.status(404).json({ error: 'Habit not found' })
    }
    console.error('Update habit error:', error)
    res.status(500).json({ error: 'Failed to update habit' })
  }
}
