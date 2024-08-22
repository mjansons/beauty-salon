import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('role_types')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('role', 'text', (c) => c.unique().notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('role_types').execute()
}
