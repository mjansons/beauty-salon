import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('role_types')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('role', 'text', (c) => c.unique().notNull())
    .execute()

  // Insert initial roles into the 'role_types' table
  await db
    .insertInto('role_types')
    .values([{ role: 'client' }, { role: 'specialist' }, { role: 'owner' }])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('role_types').execute()
}
