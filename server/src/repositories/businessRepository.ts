import type { Database } from '@server/database'
import { type UserAppointments } from '@server/database'
import { type Selectable } from 'kysely'
import { type BusinessSchema } from '@server/schemas/businessSchema'
import { type BusinessDaySchema } from '@server/schemas/businessAvailabilitySchema'
import {
  type CreateInvitation,
  type Invitation,
} from '@server/schemas/employeeInvitationSchema'

export function businessRepository(db: Database) {
  return {
    async getAllCities(): Promise<string[]> {
      const services = await db
        .selectFrom('businesses')
        .select(['city'])
        .distinct()
        .execute()

      return services.map((business) => business.city)
    },
    async getAllBusinessEmployeesByBusinessId(businessId: number): Promise<
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

    async getBusinessEmployeeByUserId(
      businessId: number,
      regesteredUserId: number
    ): Promise<
      | {
          businessId: number
          createdAt: Date
          employeeId: number
          id: number
        }
      | undefined
    > {
      return db
        .selectFrom('businessEmployees')
        .selectAll()
        .where('businessId', '=', businessId)
        .where('employeeId', '=', regesteredUserId)
        .executeTakeFirst()
    },

    async getBusinessAvailabilityById(businessId: number): Promise<
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

    async addAppointment(
      clientId: number | null,
      firstName: string,
      lastName: string,
      email: string,
      phoneNumber: string,
      businessId: number,
      businessSpecialityId: number,
      specialistId: number,
      appointmentStartTime: Date,
      appointmentEndTime: Date,
      comment: string | undefined
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
          comment: comment,
        })
        .returningAll()
        .execute()

      return appointments
    },

    async addBusiness(
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

    async editBusiness(
      id: number,
      name: string,
      ownerId: number,
      city: string,
      address: string,
      postalCode: string,
      email: string,
      phoneNumber: string
    ): Promise<BusinessSchema> {
      return await db
        .updateTable('businesses')
        .set({
          name: name,
          ownerId: ownerId,
          city: city,
          address: address,
          postalCode: postalCode,
          email: email,
          phoneNumber: phoneNumber,
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async getBusinessesByRegisteredUserId(
      regesteredUserId: number
    ): Promise<BusinessSchema[]> {
      return await db
        .selectFrom('businesses')
        .selectAll()
        .where('ownerId', '=', regesteredUserId)
        .execute()
    },

    async getUserBusinessesByBusinessId(
      regesteredUserId: number,
      businessId: number
    ): Promise<BusinessSchema | undefined> {
      return await db
        .selectFrom('businesses')
        .selectAll()
        .where('ownerId', '=', regesteredUserId)
        .where('id', '=', businessId)
        .executeTakeFirst()
    },

    async addBusinessHoursToDay(
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

    async addEmplyee(
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

    async deleteEmplyee(
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
        .where('businessId', '=', businessId)
        .where('employeeId', '=', employeeId)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async getBusinessesByTitle(searchTerm: string): Promise<BusinessSchema[]> {
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

    async getBusinessesByService(
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

    async createInvitation(invite: CreateInvitation): Promise<Invitation> {
      return await db
        .insertInto('invitations')
        .values(invite)
        .returningAll()
        .executeTakeFirstOrThrow()
    },

    async findInvitation(
      invite: CreateInvitation
    ): Promise<Invitation | undefined> {
      return await db
        .selectFrom('invitations')
        .selectAll()
        .where('businessId', '=', invite.businessId)
        .where('employeeId', '=', invite.employeeId)
        .executeTakeFirst()
    },

    async getUsersInvitations(registeredUserId: number): Promise<
      {
        email: string
        name: string
        city: string
        address: string
        businessId: number
        createdAt: Date
      }[]
    > {
      return await db
        .selectFrom('invitations')
        .innerJoin('businesses', 'businesses.id', 'invitations.businessId')
        .select([
          'invitations.businessId',
          'invitations.createdAt',
          'businesses.name',
          'businesses.city',
          'businesses.address',
          'businesses.email',
        ])
        .where('employeeId', '=', registeredUserId)
        .execute()
    },

    async deleteInvitation(
      invite: CreateInvitation
    ): Promise<Invitation | undefined> {
      return await db
        .deleteFrom('invitations')
        .where('businessId', '=', invite.businessId)
        .where('employeeId', '=', invite.employeeId)
        .returningAll()
        .executeTakeFirst()
    },
  }
}

export type BusinessRepository = ReturnType<typeof businessRepository>
