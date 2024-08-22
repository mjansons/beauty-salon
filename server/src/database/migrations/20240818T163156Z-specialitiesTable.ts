import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('specialities')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('speciality', 'text', (column) => column.unique().notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('specialities').execute()
}
