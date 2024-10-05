import type { Database, UserAppointments } from '@server/database'
import type { InsertableSpecialistDaySchema } from '@server/schemas/specialistAvailabilitySchema'
import { type Selectable } from 'kysely'

export function specialityRepository(db: Database) {
  return {
    async getAllSpecialities(): Promise<{ id: number; speciality: string }[]> {
      return db.selectFrom('specialities').selectAll().execute()
    },

    async getSpecialityByName(
      speciality: string
    ): Promise<{ id: number; speciality: string } | undefined> {
      return db
        .selectFrom('specialities')
        .selectAll()
        .where('speciality', '=', speciality)
        .executeTakeFirst()
    },

    async addSpecialist(
      registeredUserId: number,
      specialityId: number
    ): Promise<{ registeredUserId: number; specialityId: number } | undefined> {
      return db
        .insertInto('specialists')
        .values({
          registeredUserId,
          specialityId,
        })
        .returning(['registeredUserId', 'specialityId'])
        .executeTakeFirst()
    },

    async removeSpecialist(
      registeredUserId: number,
      specialityId: number
    ): Promise<{ registeredUserId: number; specialityId: number } | undefined> {
      return db
        .deleteFrom('specialists')
        .where('registeredUserId', '=', registeredUserId)
        .where('specialityId', '=', specialityId)
        .returning(['registeredUserId', 'specialityId'])
        .executeTakeFirst()
    },

    // get all specialities for a specific user
    async getUsersSpecalities(
      registeredUserId: number
    ): Promise<{ id: number; speciality: string }[]> {
      return db
        .selectFrom('specialists')
        .innerJoin(
          'specialities',
          'specialities.id',
          'specialists.specialityId'
        )
        .select(['specialities.id', 'specialities.speciality'])
        .where('specialists.registeredUserId', '=', registeredUserId)
        .execute()
    },

    async getUsersSpecalityBySpecialitytId(
      registeredUserId: number,
      specialityId: number
    ): Promise<{ id: number; speciality: string } | undefined> {
      return db
        .selectFrom('specialists')
        .innerJoin(
          'specialities',
          'specialities.id',
          'specialists.specialityId'
        )
        .select(['specialities.id', 'specialities.speciality'])
        .where('specialists.registeredUserId', '=', registeredUserId)
        .where('specialities.id', '=', specialityId)
        .executeTakeFirst()
    },

    async getUsersSpecalityByName(
      registeredUserId: number,
      speciality: string
    ): Promise<{ id: number; speciality: string } | undefined> {
      return db
        .selectFrom('specialists')
        .innerJoin(
          'specialities',
          'specialities.id',
          'specialists.specialityId'
        )
        .select(['specialities.id', 'specialities.speciality'])
        .where('specialists.registeredUserId', '=', registeredUserId)
        .where('specialities.speciality', '=', speciality)
        .executeTakeFirst()
    },

    async getSpecialistByEmail(
      email: string
    ): Promise<{ registeredUserId: number; specialityId: number } | undefined> {
      return db
        .selectFrom('specialists')
        .innerJoin(
          'registeredUsers',
          'registeredUsers.id',
          'specialists.registeredUserId'
        )
        .select(['specialists.registeredUserId', 'specialists.specialityId'])
        .where('registeredUsers.email', '=', email)
        .executeTakeFirst()
    },

    async getBusinessSpecalityById(
      businessSpecialityId: number
    ): Promise<
      | { id: number; businessId: number; price: number; specialityId: number }
      | undefined
    > {
      return db
        .selectFrom('businessSpecialities')
        .selectAll()
        .where('id', '=', businessSpecialityId)
        .executeTakeFirst()
    },

    async getBusinessSpecalitiesByBusinessId(
      businessId: number
    ): Promise<
      { id: number; businessId: number; price: number; specialityId: number }[]
    > {
      return db
        .selectFrom('businessSpecialities')
        .selectAll()
        .where('businessId', '=', businessId)
        .execute()
    },

    async getBusinessSpecalitiesByBusinessIdAndSpecialityId(
      businessId: number,
      specialityId: number
    ): Promise<
      | { id: number; businessId: number; price: number; specialityId: number }
      | undefined
    > {
      return db
        .selectFrom('businessSpecialities')
        .selectAll()
        .where('businessId', '=', businessId)
        .where('specialityId', '=', specialityId)
        .executeTakeFirst()
    },

    async addBusinessSpeciality(
      businessId: number,
      specialityId: number,
      price: number
    ): Promise<{
      id: number
      specialityId: number
      businessId: number
      price: number
    }> {
      return db
        .insertInto('businessSpecialities')
        .values({
          businessId,
          specialityId,
          price,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async addSpecialistHoursToDay(
      specialistId: number,
      dayOfWeek: number,
      startTime: string,
      endTime: string
    ): Promise<InsertableSpecialistDaySchema> {
      const value = await db
        .insertInto('specialistAvailability')
        .values({
          specialistId,
          dayOfWeek,
          startTime,
          endTime,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
      return value
    },

    async getSpecialistAvailabilityById(specialistId: number): Promise<
      {
        id: number
        specialistId: number
        dayOfWeek: number
        startTime: string
        endTime: string
      }[]
    > {
      return db
        .selectFrom('specialistAvailability')
        .selectAll()
        .where('specialistId', '=', specialistId)
        .execute()
    },

    async getSpecialistAppointmentsByTime(
      specialistId: number,
      startTime: Date,
      endTime: Date
    ): Promise<Selectable<UserAppointments>[]> {
      const appointments = await db
        .selectFrom('userAppointments')
        .selectAll()
        .where('specialistId', '=', specialistId)
        .where('appointmentStartTime', '>=', startTime)
        .where('appointmentEndTime', '<=', endTime)
        .execute()

      return appointments
    },
  }
}

export type SpecialityRepository = ReturnType<typeof specialityRepository>
