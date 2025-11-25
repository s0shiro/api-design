import db from './connection.ts'
import { entries, habits, habitTags, tags, users } from './schema.ts'

const seed = async () => {
  console.log('🌱 Seeding database...')

  try {
    console.log('Clearing database...')
    await db.delete(entries)
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    console.log('Creating demo user...')
    const [demoUser] = await db
      .insert(users)
      .values({
        email: 'demo@app.com',
        password: 'password',
        firstName: 'demo',
        lastName: 'person',
        username: 'demo',
      })
      .returning()

    console.log('Creating Tags...')
    const [healthTag] = await db
      .insert(tags)
      .values({ name: 'health', color: '#10b981' })
      .returning()

    console.log('Creating Habits...')
    const [waterHabit] = await db
      .insert(habits)
      .values({
        userId: demoUser.id,
        name: 'Drink Water',
        description: '8 glasses per day',
        frequency: 'daily',
        targetCount: 8,
      })
      .returning()

    await db.insert(habitTags).values([
      {
        habitId: waterHabit.id,
        tagId: healthTag.id,
      },
    ])

    console.log('Adding completion entries...')

    const today = new Date()
    today.setHours(12, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      await db.insert(entries).values({
        habitId: waterHabit.id,
        completionDate: date,
      })
    }

    console.log('✅ Seed complete.')
    console.log(`Demo user:`)
    console.log(`Email: ${demoUser.email}:`)
    console.log(`Username: ${demoUser.username}:`)
    console.log(`Password: ${demoUser.password}:`)
  } catch (error) {
    console.error('❌ seed failed.', error)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export default seed
