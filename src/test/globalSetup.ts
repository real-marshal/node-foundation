import Knex from 'knex'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from 'testcontainers'

require('tsconfig-paths/register')

/* eslint-disable no-var, vars-on-top */

declare global {
  var postgresContainer: StartedPostgreSqlContainer
}

export default async function globalSetup() {
  globalThis.postgresContainer = await new PostgreSqlContainer('postgres:15.1')
    .withStartupTimeout(30)
    .start()

  // Will be used by DBService
  process.env.DB_HOST = globalThis.postgresContainer.getHost()
  process.env.DB_PORT = globalThis.postgresContainer.getPort()
  process.env.DB_NAME = globalThis.postgresContainer.getDatabase()
  process.env.DB_USER = globalThis.postgresContainer.getUsername()
  process.env.DB_PASSWORD = globalThis.postgresContainer.getPassword()

  const knex = Knex({
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'migration',
      extension: 'ts',
    },
  })

  await knex.migrate.up()

  await knex.destroy()
}
