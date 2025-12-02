import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { habits } from '../../db/schema.ts'
import z from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { registry } from '../index.ts'

extendZodWithOpenApi(z)

// Define schemas manually (more control, avoids drizzle-zod issues)
export const createHabitSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional(),
    frequency: z.string().min(1, 'Frequency is required'),
    targetCount: z.number().int().positive().default(1),
    isActive: z.boolean().default(true),
    tagIds: z.array(z.string().uuid()).default([]),
  })
  .openapi('CreateHabitRequest')

// Update habit request (all fields optional)
export const updateHabitSchema = createHabitSchema
  .partial()
  .openapi('UpdateHabitRequest')

// Habit response
export const habitResponseSchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    frequency: z.string(),
    targetCount: z.number().nullable(),
    isActive: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi('HabitResponse')

// Params schema
export const habitParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .openapi('HabitParams')

// Register schemas
registry.register('CreateHabitRequest', createHabitSchema)
registry.register('UpdateHabitRequest', updateHabitSchema)
registry.register('HabitResponse', habitResponseSchema)
registry.register('HabitParams', habitParamsSchema)

// Export types
export type CreateHabitInput = z.infer<typeof createHabitSchema>
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>
export type HabitResponse = z.infer<typeof habitResponseSchema>
export type HabitParams = z.infer<typeof habitParamsSchema>
