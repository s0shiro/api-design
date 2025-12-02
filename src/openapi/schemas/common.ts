import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { registry } from '../index.ts'

extendZodWithOpenApi(z)

export const errorResponseSchema = z
  .object({
    error: z.string(),
    message: z.string().optional(),
    details: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
        }),
      )
      .optional(),
  })
  .openapi('ErrorResponse')

registry.register('ErrorResponse', errorResponseSchema)
