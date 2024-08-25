import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('specialists')
    .addColumn('registered_user_id', 'integer', (column) =>
      column.references('registered_users.id').notNull()
    )
    .addColumn('speciality_id', 'integer', (column) =>
      column.references('specialities.id').notNull()
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('specialists').execute()
}
