import db from '../db/connection.ts'
import { habits } from '../db/schema.ts'
import { desc, eq } from 'drizzle-orm'

export async function getHabitsWithTagsByUser(userId: string) {
  const rows = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
    with: {
      habitTags: {
        with: { tag: true },
      },
    },
    orderBy: [desc(habits.createdAt)],
  })

  return rows.map((h) => {
    // strip junction table, expose tags[]
    const { habitTags, ...rest } = h
    return {
      ...rest,
      tags: habitTags.map((ht) => ht.tag),
    }
  })
}
