import request from 'supertest'
import { cleanUpDatabase, createTestUser } from './setup/dbHelper.ts'
import app from '../server.ts'

describe('Habit API', () => {
  afterEach(async () => {
    await cleanUpDatabase()
  })

  describe('POST /api/habit', () => {
    it('should create a new habit', async () => {
      const { token } = await createTestUser()

      const response = await request(app)
        .post('/api/habit')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Exercise daily',
          description: 'Daily exercise routine',
          frequency: 'daily',
          targetCount: 1,
        })

      expect(response.status).toBe(201)
      expect(response.body.habit).toBeDefined()
      expect(response.body.habit.name).toBe('Exercise daily')
    })
  })
})
