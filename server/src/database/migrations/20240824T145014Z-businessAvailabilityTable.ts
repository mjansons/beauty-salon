import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('business_availability')
    .addColumn('id', 'integer', (c) =>
      c.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('business_id', 'integer', (col) =>
      col.notNull().references('businesses.id')
    )
    .addColumn('day_of_week', 'integer', (col) =>
      col.notNull().check(sql`day_of_week BETWEEN 0 AND 6`)
    )
    .addColumn('start_time', 'time', (col) => col.notNull())
    .addColumn('end_time', 'time', (col) => col.notNull())
    .addUniqueConstraint('business_availability_unique', ['business_id', 'day_of_week'])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('business_availability').execute()
}
