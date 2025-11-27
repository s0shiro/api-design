import request from 'supertest'
import { cleanUpDatabase, createTestUser } from './setup/dbHelper.ts'
import app from '../server.ts'

describe('Authentication Endpoints', () => {
  afterEach(async () => {
    await cleanUpDatabase()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'testemail@test.com',
        username: 'testemail',
        password: 'password',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')
    })
  })

  describe('POST /api/auth/login', () => {
    it('it should login with valid credentials', async () => {
      const testUser = await createTestUser()

      const credentials = {
        email: testUser.user.email,
        password: testUser.rawPassword,
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(201)

      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body).not.toHaveProperty('password')
    })
  })
})
