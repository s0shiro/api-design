import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed!',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
    }
  }
}

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation params failed!',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
    }
  }
}

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation query failed!',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
    }
  }
}
