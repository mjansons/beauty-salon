import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('unregistered_users')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('first_name', 'text', (column) => column.notNull())
    .addColumn('last_name', 'text', (column) => column.notNull())
    .addColumn('email', 'text')
    .addColumn('phone_number', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('unregistered_users').execute()
}
