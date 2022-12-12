// noinspection SqlResolve

import Postgres from 'postgres'
import packageJSON from '@/package.json'
import { snakeCase } from 'lodash'
import type { AppFastifyInstance } from '@/app/app'

const CLOSE_TIMEOUT = 5 as const

export default function DBService(f: AppFastifyInstance) {
  const sql = Postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    transform: Postgres.camel,
    onnotice: f.log.info,
    connection: {
      // eslint-disable-next-line camelcase
      application_name: snakeCase(packageJSON.name),
    },
  })

  f.addHook('onClose', async () => {
    f.log.info('Closing DB connections')
    await sql.end({ timeout: CLOSE_TIMEOUT })
  })

  function createCRUD<
    Model extends object,
    ModelId extends number,
    ModelInitializer extends object,
    ModelMutator extends object
  >(table: string) {
    async function create(values: ModelInitializer): Promise<void> {
      await sql`
        insert into ${sql(table)} ${sql(values as object)} returning id
      `
    }

    async function get(id: ModelId): Promise<Model | undefined> {
      const [row] = await sql<Model[]>`
        select *
        from ${sql(table)}
        where id = ${id}
      `
      return row
    }

    async function update(id: ModelId, values: ModelMutator): Promise<void> {
      await sql`
        update ${sql(table)}
        set ${sql(values as object)}
        where id = ${id}
      `
    }

    async function _delete(id: ModelId): Promise<void> {
      await sql`
        delete
        from ${sql(table)}
        where id = ${id}
      `
    }

    return {
      create,
      get,
      update,
      delete: _delete,
    }
  }

  return {
    sql,
    createCRUD,
  }
}
