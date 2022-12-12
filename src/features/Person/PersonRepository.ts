import type { Person, PersonId, PersonInitializer, PersonMutator } from '@/schemas'
import type { AppFastifyInstance } from '@/app/app'

export default function PersonRepository(f: AppFastifyInstance) {
  const { sql, createCRUD } = f.DBService

  const CRUD = createCRUD<Person, PersonId, PersonInitializer, PersonMutator>('person')

  async function countPersons(): Promise<number> {
    const [countRow] = await sql<Array<{ count: number }>>`
      select count(*)::int
      from person
    `
    return countRow!.count
  }

  return {
    ...CRUD,
    countPersons,
  }
}
