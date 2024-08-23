import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  // Insert initial roles into the 'role_types' table
  await db
    .insertInto('role_types')
    .values([{ role: 'client' }, { role: 'specialist' }, { role: 'owner' }])
    .execute()

  // Insert initial specialities into the 'specialities' table
  await db
    .insertInto('specialities')
    .values([
      { speciality: 'haircut' },
      { speciality: 'nails' },
      { speciality: 'makeup' },
    ])
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.deleteFrom('role_types').execute()
  await db.deleteFrom('specialities').execute()
}
