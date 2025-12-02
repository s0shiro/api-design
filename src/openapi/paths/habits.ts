import { registry } from '../index.ts'
import {
  createHabitSchema,
  updateHabitSchema,
  habitResponseSchema,
  habitParamsSchema,
} from '../schemas/habits.ts'
import z from 'zod'

// GET /habits - List all habits for authenticated user
registry.registerPath({
  method: 'get',
  path: '/habit',
  tags: ['Habits'],
  summary: 'Get all user habits',
  description: 'Retrieve all habits with their tags for the authenticated user',
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'List of habits with tags',
      content: {
        'application/json': {
          schema: z.object({
            habits: z.array(
              habitResponseSchema.extend({
                tags: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    color: z.string().nullable(),
                  }),
                ),
              }),
            ),
          }),
        },
      },
    },
    401: {
      description: 'Unauthorized',
    },
    500: {
      description: 'Internal server error',
    },
  },
})

// POST /habits - Create a new habit
registry.registerPath({
  method: 'post',
  path: '/habits',
  tags: ['Habits'],
  summary: 'Create a habit',
  description: 'Create a new habit for the authenticated user',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createHabitSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Habit created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            habit: habitResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
    },
    401: {
      description: 'Unauthorized',
    },
    500: {
      description: 'Failed to create habit',
    },
  },
})

// PATCH /habits/:id - Update a habit
registry.registerPath({
  method: 'patch',
  path: '/habit/{id}',
  tags: ['Habits'],
  summary: 'Update a habit',
  description: 'Partially update an existing habit',
  security: [{ bearerAuth: [] }],
  request: {
    params: habitParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: updateHabitSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Habit updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            habit: habitResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
    },
    401: {
      description: 'Unauthorized',
    },
    404: {
      description: 'Habit not found',
    },
    500: {
      description: 'Failed to update habit',
    },
  },
})
