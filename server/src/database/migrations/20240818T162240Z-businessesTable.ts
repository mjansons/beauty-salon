import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('businesses')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('name', 'text', (column) => column.notNull().unique())
    .addColumn('owner_id', 'integer', (column) =>
      column.references('registered_users.id').notNull().onDelete('cascade')
    )
    .addColumn('address', 'text', (column) => column.notNull())
    .addColumn('city', 'text', (column) => column.notNull())
    .addColumn('postal_code', 'text', (column) => column.notNull())
    .addColumn('phone_number', 'text', (column) => column.notNull())
    .addColumn('email', 'text', (column) => column.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('businesses').execute()
}
