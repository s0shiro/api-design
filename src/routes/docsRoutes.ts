import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { generateOpenAPIDocument } from '../openapi/index.ts'

const router = Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(generateOpenAPIDocument()))

// Expose raw OpenAPI JSON
router.get('/json', (req, res) => {
  res.json(generateOpenAPIDocument())
})

export default router
