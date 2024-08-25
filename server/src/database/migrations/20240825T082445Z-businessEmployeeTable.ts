import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('business_employees')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('employee_id', 'integer', (col) =>
      col.notNull().references('registered_users.id')
    )
    .addColumn('business_id', 'integer', (col) =>
      col.notNull().references('businesses.id')
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('business_specialists').execute()
}
