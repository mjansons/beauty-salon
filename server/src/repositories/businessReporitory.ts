import type { Database } from '@server/database'
import { type UserAppointments } from '@server/database'
import { type Selectable } from 'kysely'
import { type BusinessSchema } from '@server/schemas/businessSchema'

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
    ): Promise<BusinessSchema[]> {
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
        .execute()
    },
  }
}

export type BusinessRepository = ReturnType<typeof businessRepository>
