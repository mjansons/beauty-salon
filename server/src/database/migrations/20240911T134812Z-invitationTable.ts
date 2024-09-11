import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('invitations')
    .addColumn('employee_id', 'integer', (col) =>
      col.notNull().references('registered_users.id')
    )
    .addColumn('business_id', 'integer', (col) =>
      col.notNull().references('businesses.id')
    )
    .addColumn('created_at', 'timestamptz', (column) =>
      column.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addUniqueConstraint('unique_invitation_id', [
        'employee_id',
        'business_id',
      ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('invitations').execute()
}
