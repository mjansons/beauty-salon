import type { Database } from '@server/database'
import type { InsertableSpecialistDaySchema } from '@server/schemas/specialistAvailabilitySchema'
import { type UserAppointments } from '@server/database'
import { type Selectable } from 'kysely'

export function specialityRepository(db: Database) {
  return {
    async get_all_specialities(): Promise<
      { id: number; speciality: string }[]
    > {
      return db.selectFrom('specialities').selectAll().execute()
    },

    async add_specialist(
      registeredUserId: number,
      specialityId: number
    ): Promise<{ registeredUserId: number; specialityId: number } | undefined> {
      return db
        .insertInto('specialists')
        .values({
          registeredUserId: registeredUserId,
          specialityId: specialityId,
        })
        .returning(['registeredUserId', 'specialityId'])
        .executeTakeFirstOrThrow()
    },

    // get all specialities for a specific user
    async get_users_specalities(
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

    async get_specialist_by_email(
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

    async get_business_specality_by_id(
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

    async get_business_specalities_by_business_id(
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

    async add_business_speciality(
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
          businessId: businessId,
          specialityId: specialityId,
          price: price,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async add_specialist_hours_to_day(
      specialistId: number,
      dayOfWeek: number,
      startTime: string,
      endTime: string
    ): Promise<InsertableSpecialistDaySchema> {
      return await db
        .insertInto('specialistAvailability')
        .values({
          specialistId,
          dayOfWeek,
          startTime,
          endTime,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async get_specialist_availability_by_id(specialistId: number): Promise<
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

    async get_specialist_appointments_by_time(
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
