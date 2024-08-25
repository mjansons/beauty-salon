import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user_appointments')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('client_id', 'integer', (column) =>
      column.references('registered_users.id')
    )
    .addColumn('business_id', 'integer', (column) =>
      column.references('businesses.id').notNull()
    )
    .addColumn('specialist_id', 'integer', (column) =>
      column.references('registered_users.id').notNull()
    )
    .addColumn('business_speciality_id', 'integer', (column) =>
      column.references('business_specialities.id').notNull()
    )
    .addColumn('appointment_start_time', 'timestamptz', (c) => c.notNull())
    .addColumn('appointment_end_time', 'timestamptz', (c) => c.notNull())

    .addColumn('first_name', 'text', (c) => c.notNull())
    .addColumn('last_name', 'text', (c) => c.notNull())
    .addColumn('email', 'text', (c) => c.notNull())
    .addColumn('phone_number', 'text', (c) => c.notNull())

    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user_appointments').execute()
}
