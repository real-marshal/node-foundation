import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    create table person(
        id int generated always as identity primary key,
        name text not null,
        email text not null
    );
  `)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
