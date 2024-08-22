import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('unregistered_user_appointments')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('client_id', 'integer', (column) =>
      column.references('unregistered_users.id').notNull()
    )
    .addColumn('business_id', 'integer', (column) =>
      column.references('businesses.id').notNull()
    )
    .addColumn('specialist_id', 'integer', (column) =>
      column.references('specialists.id').notNull()
    )
    .addColumn('service_id', 'integer', (column) =>
      column.references('specialities.id').notNull()
    )
    .addColumn('appointment_time', 'timestamptz', (c) => c.notNull())
    .addColumn('status', 'text', (c) => c.notNull())
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('unregistered_user_appointments').execute()
}
