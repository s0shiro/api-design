import { sql } from 'drizzle-orm'
import db from '../../db/connection.ts'
import { entries, habits, habitTags, tags, users } from '../../db/schema.ts'
import { execSync } from 'child_process'

export default async function setup() {
  console.log('📁Setting up the databse.')
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)

    console.log('🚀 Pushing schema...')

    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log('Test DB created.')
  } catch (error) {
    console.error('❌Failed to setup db', error)
    throw error
  }

  return async () => {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
      process.exit(0)
    } catch (error) {
      console.error('❌Failed to setup db', error)
      throw error
    }
  }
}
