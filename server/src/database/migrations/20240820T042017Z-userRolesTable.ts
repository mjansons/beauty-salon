import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user_roles')
    .addColumn('registered_user_id', 'integer', (column) =>
      column.references('registered_users.id').notNull()
    )
    .addColumn('role_id', 'integer', (column) =>
      column.references('role_types.id').notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user_roles').execute()
}
