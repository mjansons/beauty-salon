import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('business_specialities')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('business_id', 'integer', (column) =>
      column.references('businesses.id').onDelete('cascade').notNull()
    )
    .addColumn('speciality_id', 'integer', (column) =>
      column.references('specialities.id').onDelete('cascade').notNull()
    )
    .addColumn('price', 'integer', (column) => column.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('business_specialities').execute()
}
