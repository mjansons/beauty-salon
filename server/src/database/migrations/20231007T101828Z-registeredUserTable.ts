import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('registered_users')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('first_name', 'text', (column) => column.notNull())
    .addColumn('last_name', 'text', (column) => column.notNull())
    .addColumn('email', 'text', (column) => column.unique().notNull())
    .addColumn('password', 'text', (column) => column.notNull())
    .addColumn('phone_number', 'text', (column) => column.notNull())
    .addColumn('is_onboarded', 'boolean', (column) =>
      column.defaultTo(false).notNull()
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('registered_users').execute()
}
