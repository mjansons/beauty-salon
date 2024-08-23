import type { Database } from '@server/database'

export function specialityRepository(db: Database) {
  return {
    async get_all_specialities(): Promise< { id: number; speciality: string; }[]> {
      return db
        .selectFrom('specialities')
        .selectAll()
        .execute()
    },

    async add_specialist(
      specialistId: number,
      specialityId: number
    ): Promise<{ specialistId: number; specialityId: number } | undefined> {
      return db
        .insertInto('specialists')
        .values({ specialistId: specialistId, specialityId: specialityId })
        .returning(['specialistId', 'specialityId'])
        .executeTakeFirstOrThrow()
    },

    // get all specialities for a specific user
    async get_users_specalities(userId: number): Promise< { id: number; speciality: string; }[]> {
      return db
        .selectFrom('specialists')
        .innerJoin('specialities', 'specialities.id', 'specialists.specialityId')
        .select(['specialities.id', 'specialities.speciality'])
        .where("specialists.specialistId", '=', userId)
        .execute();

    },
  }
}

export type SpecialityRepository = ReturnType<typeof specialityRepository>
