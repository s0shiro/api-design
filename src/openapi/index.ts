import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// Extend Zod once at module load
extendZodWithOpenApi(z)

// Global registry - import this everywhere
export const registry = new OpenAPIRegistry()

// Register Bearer Auth security scheme for JWT
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your JWT token',
})

export const generateOpenAPIDocument = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Habit Tracker API',
      version: '1.0.0',
      description: 'API for tracking habits',
    },
    servers: [{ url: '/api' }],
    tags: [
      { name: 'Authentication', description: 'User auth endpoints' },
      { name: 'Habits', description: 'Habit management' },
    ],
  })
}
