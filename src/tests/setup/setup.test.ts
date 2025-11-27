import { cleanUpDatabase, createTestUser } from './dbHelper.ts'

describe('Test setup', () => {
  test('Should connect to the test databse', async () => {
    const { user, token } = await createTestUser()

    expect(user).toBeDefined()
    await cleanUpDatabase()
  })
})
