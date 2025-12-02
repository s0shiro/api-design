import { registry } from '../index.ts'
import {
  loginSchema,
  registerSchema,
  authResponseSchema,
} from '../schemas/auth.ts'
import { errorResponseSchema } from '../schemas/common.ts'

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  summary: 'User login',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': { schema: loginSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful login',
      content: {
        'application/json': { schema: authResponseSchema },
      },
    },
    401: {
      description: 'Invalid credentials',
      content: {
        'application/json': { schema: errorResponseSchema },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  summary: 'Register new user',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': { schema: registerSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': { schema: authResponseSchema },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': { schema: errorResponseSchema },
      },
    },
  },
})
