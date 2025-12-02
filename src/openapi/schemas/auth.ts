import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { registry } from '../index.ts'
import { createInsertSchema } from 'drizzle-zod'
import { users } from '../../db/schema.ts'

extendZodWithOpenApi(z)

// Login - custom schema (not from DB)
export const loginSchema = z
  .object({
    email: z.email('Invalid email'),
    password: z.string().min(1, 'Password is required!'),
  })
  .openapi('LoginRequest', {
    example: {
      email: 'demo@app.com',
      password: 'password',
    },
  })

// Register - extend from Drizzle schema, then add OpenAPI metadata
const baseInsertUserSchema = createInsertSchema(users, {
  email: z.string().email('Invalid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = baseInsertUserSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .openapi('RegisterRequest')

// Response schemas
export const userResponseSchema = z
  .object({
    id: z.uuid(),
    email: z.email(),
    username: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    createdAt: z.string().datetime(),
  })
  .openapi('UserResponse')

export const authResponseSchema = z
  .object({
    message: z.string(),
    token: z.string(),
    user: userResponseSchema,
  })
  .openapi('AuthResponse')

// Register with OpenAPI
registry.register('LoginRequest', loginSchema)
registry.register('RegisterRequest', registerSchema)
registry.register('UserResponse', userResponseSchema)
registry.register('AuthResponse', authResponseSchema)

// Export types
export type LoginCredentials = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
