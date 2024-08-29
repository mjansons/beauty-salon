import type { Database } from '@server/database'
import { type UserAppointments } from '@server/database'
import { type Selectable } from 'kysely'
import { type BusinessSchema } from '@server/schemas/businessSchema'
import { BusinessDaySchema } from '@server/schemas/businessAvailabilitySchema'

export function businessRepository(db: Database) {
  return {
    async get_business_employees_by_business_id(businessId: number): Promise<
      {
        businessId: number
        createdAt: Date
        employeeId: number
        id: number
      }[]
    > {
      return db
        .selectFrom('businessEmployees')
        .selectAll()
        .where('businessId', '=', businessId)
        .execute()
    },

    async get_business_availability_by_id(businessId: number): Promise<
      {
        id: number
        businessId: number
        dayOfWeek: number
        startTime: string
        endTime: string
      }[]
    > {
      return db
        .selectFrom('businessAvailability')
        .selectAll()
        .where('businessId', '=', businessId)
        .execute()
    },

    async add_appointment(
      clientId: number | null,
      firstName: string,
      lastName: string,
      email: string,
      phoneNumber: string,
      businessId: number,
      businessSpecialityId: number,
      specialistId: number,
      appointmentStartTime: Date,
      appointmentEndTime: Date
    ): Promise<Selectable<UserAppointments>[]> {
      const appointments = await db
        .insertInto('userAppointments')
        .values({
          appointmentEndTime: appointmentEndTime,
          appointmentStartTime: appointmentStartTime,
          businessId: businessId,
          businessSpecialityId: businessSpecialityId,
          clientId: clientId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          specialistId: specialistId,
        })
        .returningAll()
        .execute()

      return appointments
    },

    async add_business(
      name: string,
      ownerId: number,
      city: string,
      address: string,
      postalCode: string,
      email: string,
      phoneNumber: string
    ): Promise<BusinessSchema> {
      return await db
        .insertInto('businesses')
        .values({
          name: name,
          ownerId: ownerId,
          city: city,
          address: address,
          postalCode: postalCode,
          email: email,
          phoneNumber: phoneNumber,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async get_businesses_by_registered_user_id(
      regesteredUserId: number
    ): Promise<BusinessSchema[]> {
      return await db
        .selectFrom('businesses')
        .selectAll()
        .where('ownerId', '=', regesteredUserId)
        .execute()
    },

    async add_business_hours_to_day(
      businessId: number,
      dayOfWeek: number,
      startTime: string,
      endTime: string
    ): Promise<BusinessDaySchema> {
      return await db
        .insertInto('businessAvailability')
        .values({
          businessId,
          dayOfWeek,
          startTime,
          endTime,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async add_emplyee(
      businessId: number,
      employeeId: number
    ): Promise<{
      id: number
      businessId: number
      employeeId: number
      createdAt: Date
    }> {
      return await db
        .insertInto('businessEmployees')
        .values({
          businessId,
          employeeId,
        })
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async delete_emplyee(
      businessId: number,
      employeeId: number
    ): Promise<{
      id: number
      businessId: number
      employeeId: number
      createdAt: Date
    }> {
      return await db
        .deleteFrom('businessEmployees')
        .where("businessId", "=", businessId)
        .where("employeeId", "=", employeeId)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async get_businesses_by_title(
      searchTerm: string
    ): Promise<BusinessSchema[]> {
      return await db
        .selectFrom('businesses')
        .selectAll()
        .where((eb) =>
          eb.or([
            eb('name', 'ilike', `%${searchTerm}%`),
            eb('address', 'ilike', `%${searchTerm}%`),
            eb('city', 'ilike', `%${searchTerm}%`),
            eb('email', 'ilike', `%${searchTerm}%`),
            eb('phoneNumber', 'ilike', `%${searchTerm}%`),
            eb('postalCode', 'ilike', `%${searchTerm}%`),
          ])
        )
        .limit(10)
        .execute()
    },

    async get_businesses_by_service(
      searchTerm: string
    ): Promise<BusinessSchema[]> {
      return await db
        .selectFrom('businesses')
        .select([
          'businesses.address',
          'businesses.city',
          'businesses.createdAt',
          'businesses.email',
          'businesses.id',
          'businesses.name',
          'businesses.ownerId',
          'businesses.phoneNumber',
          'businesses.postalCode',
        ])
        .leftJoin(
          'businessSpecialities',
          'businessSpecialities.businessId',
          'businesses.id'
        )
        .leftJoin(
          'specialities',
          'businessSpecialities.specialityId',
          'specialities.id'
        )
        .where((eb) =>
          eb.or([
            eb('specialities.speciality', 'ilike', `%${searchTerm}%`),
            eb('businesses.name', 'ilike', `%${searchTerm}%`),
            eb('businesses.address', 'ilike', `%${searchTerm}%`),
            eb('businesses.city', 'ilike', `%${searchTerm}%`),
            eb('businesses.email', 'ilike', `%${searchTerm}%`),
            eb('businesses.phoneNumber', 'ilike', `%${searchTerm}%`),
            eb('businesses.postalCode', 'ilike', `%${searchTerm}%`),
          ])
        )
        .limit(10)
        .execute()
    },
  }
}

export type BusinessRepository = ReturnType<typeof businessRepository>
