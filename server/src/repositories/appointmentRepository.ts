/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import type { Database } from '@server/database'
import { sql } from 'kysely'
import type { DBAppointment } from '@server/schemas/appointmentSchema'

export function appointmentRepository(db: Database) {
  return {
    async getAppointmentsBySpecialistId(date: Date, specialistId: number) {
      const values = await db
        .selectFrom('userAppointments')
        .innerJoin(
          'businessSpecialities',
          'businessSpecialities.id',
          'userAppointments.businessSpecialityId'
        )
        .innerJoin(
          'specialities',
          'businessSpecialities.specialityId',
          'specialities.id'
        )
        .where('specialistId', '=', specialistId)
        .where(sql`DATE(appointment_start_time)`, '>=', date)
        .orderBy('appointmentStartTime', `asc`)
        .select([
          'userAppointments.appointmentStartTime',
          'userAppointments.appointmentEndTime',
          'specialities.speciality',
          'userAppointments.firstName',
          'userAppointments.lastName',
          'userAppointments.phoneNumber',
          'userAppointments.comment',
        ])
        .execute()
      return values
    },

    async getPersonalAppointments(date: Date, registeredUserId: number) {
      const values = await db
        .selectFrom('userAppointments')
        .innerJoin('businesses', 'businesses.id', 'userAppointments.businessId')
        .innerJoin(
          'businessSpecialities',
          'businessSpecialities.id',
          'userAppointments.businessSpecialityId'
        )
        .innerJoin(
          'specialities',
          'businessSpecialities.specialityId',
          'specialities.id'
        )
        .innerJoin(
          'registeredUsers',
          'registeredUsers.id',
          'userAppointments.specialistId'
        )
        .where('clientId', '=', registeredUserId)
        .where(sql`DATE(appointment_start_time)`, '>=', date)
        .orderBy('appointmentStartTime', `asc`)
        .select([
          'specialities.speciality',
          'userAppointments.appointmentStartTime',
          'userAppointments.appointmentEndTime',
          'businessSpecialities.price',
          'businesses.name',
          'businesses.city',
          'businesses.address',
          'businesses.phoneNumber',
          'businesses.postalCode',
          'registeredUsers.firstName as specialistFirstName',
          'registeredUsers.lastName as specialistLastName',
        ])
        .execute()
      return values
    },

    async getBusinessAppointments(date: Date, businessId: number) {
      const values = await db
        .selectFrom('userAppointments')
        .innerJoin(
          'businessSpecialities',
          'businessSpecialities.id',
          'userAppointments.businessSpecialityId'
        )
        .innerJoin(
          'specialities',
          'businessSpecialities.specialityId',
          'specialities.id'
        )
        .innerJoin(
          'registeredUsers as specialists',
          'specialists.id',
          'userAppointments.specialistId'
        )
        .where('userAppointments.businessId', '=', businessId)
        .where(sql`DATE(user_appointments.appointment_start_time)`, '>=', date)
        .orderBy('userAppointments.appointmentStartTime', 'asc')
        .select([
          'specialities.speciality',
          'userAppointments.appointmentStartTime as appointmentStartTime',
          'userAppointments.appointmentEndTime as appointmentEndTime',
          'userAppointments.firstName as clientFirstName',
          'userAppointments.lastName as clientLastName',
          'userAppointments.phoneNumber as clientPhoneNumber',
          'userAppointments.comment as comment',
          'specialists.firstName as specialistFirstName',
          'specialists.lastName as specialistLastName',
        ])
        .execute()

      return values
    },

    async getSpecialistBookingsAndWorkSchedule(
      location: string,
      service: string,
      date: string, // YYYY-MM-DD
      page: number
    ) {
      const limit = 10
      const startIndex = limit * (page - 1)
      const endIndex = startIndex + limit
      let offset = 0
      const foundSpecialists = []

      const queryDate = new Date(date)
      const endDate = new Date(queryDate)
      endDate.setDate(endDate.getDate() + 7)

      const dayOfWeek = queryDate.getDay()

      type PotentialSpecialists = {
        businessId: number
        address: string
        city: string
        businessName: string
        businessEmail: string
        businessPhoneNumber: string
        postalCode: string
        specialistId: number
        businessSpecialityId: number
        specialityName: string
        price: number
        specialistFirstName: string
        specialistLastName: string
        startTime: string
        endTime: string
      }

      async function getPotentialSpecialists(
        queryOffset: number,
        queryLimit: number
      ): Promise<PotentialSpecialists[]> {
        const values = await db
          .selectFrom('specialists')
          .innerJoin(
            'registeredUsers',
            'registeredUsers.id',
            'specialists.registeredUserId'
          )
          .innerJoin(
            'specialities',
            'specialities.id',
            'specialists.specialityId'
          )
          .innerJoin(
            'businessEmployees',
            'businessEmployees.employeeId',
            'specialists.registeredUserId'
          )
          .innerJoin(
            'businesses',
            'businesses.id',
            'businessEmployees.businessId'
          )
          .innerJoin('businessSpecialities', (join) =>
            join
              .onRef('businessSpecialities.businessId', '=', 'businesses.id')
              .onRef(
                'businessSpecialities.specialityId',
                '=',
                'specialities.id'
              )
          )
          .innerJoin(
            'specialistAvailability',
            'specialistAvailability.specialistId',
            'specialists.registeredUserId'
          )
          .innerJoin(
            'businessAvailability',
            'businessAvailability.businessId',
            'businesses.id'
          )
          .where('businesses.city', '=', location)
          .where('businessAvailability.dayOfWeek', '=', dayOfWeek)
          .where('specialities.speciality', '=', service)
          .where('specialistAvailability.dayOfWeek', '=', dayOfWeek)
          .where(
            sql<boolean>`(specialist_availability.end_time - specialist_availability.start_time) >= INTERVAL '60 minutes'`
          )
          .where(
            sql<boolean>`(business_availability.end_time - business_availability.start_time) >= INTERVAL '60 minutes'`
          )
          .select([
            'businesses.id as businessId',
            'businesses.address',
            'businesses.city',
            'businesses.name as businessName',
            'businesses.email as businessEmail',
            'businesses.phoneNumber as businessPhoneNumber',
            'businesses.postalCode',
            'specialists.registeredUserId as specialistId',
            'businessSpecialities.id as businessSpecialityId',
            'specialities.speciality as specialityName',
            'businessSpecialities.price',
            'registeredUsers.firstName as specialistFirstName',
            'registeredUsers.lastName as specialistLastName',
            'specialistAvailability.startTime',
            'specialistAvailability.endTime',
          ])
          .distinctOn('specialists.registeredUserId')
          .orderBy('specialists.registeredUserId', 'desc')
          .offset(queryOffset)
          .limit(queryLimit)
          .execute()

        return values
      }

      async function getSpecialistSchedule(specialistId: number) {
        const values = await db
          .selectFrom('specialistAvailability')
          .where('specialistId', '=', specialistId)
          .selectAll()
          .execute()
        return values
      }

      async function getSpecialistAppointments(
        specialistId: number
      ): Promise<DBAppointment[]> {
        const values = await db
          .selectFrom('userAppointments')
          .where('specialistId', '=', specialistId)
          .where(sql`DATE(appointment_start_time)`, '>=', date)
          .orderBy('appointmentStartTime', `asc`)
          .selectAll()
          .execute()
        return values
      }

      function maxTime(time1: string, time2: string): string {
        return time1 > time2 ? time1 : time2
      }

      function minTime(time1: string, time2: string): string {
        return time1 < time2 ? time1 : time2
      }

      async function getBusinessOperationalHours(businessId: number): Promise<
        {
          id: number
          businessId: number
          dayOfWeek: number
          endTime: string
          startTime: string
        }[]
      > {
        const values = await db
          .selectFrom('businessAvailability')
          .where('businessId', '=', businessId)
          .selectAll()
          .execute()

        return values
      }

      function computeOverlappingWorkingHours(
        specialistSchedule: {
          dayOfWeek: number
          startTime: string
          endTime: string
        }[],
        businessSchedule: {
          dayOfWeek: number
          startTime: string
          endTime: string
        }[]
      ): Record<number, [string, string]> {
        const workingHours: Record<number, [string, string]> = {}

        for (const specialistDay of specialistSchedule) {
          const businessDay = businessSchedule.find(
            (b) => b.dayOfWeek === specialistDay.dayOfWeek
          )

          if (businessDay) {
            // Compute the overlapping time
            const startTime = maxTime(
              specialistDay.startTime,
              businessDay.startTime
            )
            const endTime = minTime(specialistDay.endTime, businessDay.endTime)

            if (startTime < endTime) {
              // There is an overlap
              workingHours[specialistDay.dayOfWeek] = [startTime, endTime]
            }
          }
        }
        return workingHours
      }

      function hasSixtyMinuteGap(
        appointments: DBAppointment[],
        availabilityStart: string,
        availabilityEnd: string
      ): boolean {
        const availabilityStartTime = new Date(`${date}T${availabilityStart}`)
        const availabilityEndTime = new Date(`${date}T${availabilityEnd}`)

        const filteredAppointments = appointments.filter((app) => {
          const appointmentDate = new Date(app.appointmentStartTime)
            .toISOString()
            .split('T')[0]
          return appointmentDate === date
        })

        if (filteredAppointments.length === 0) {
          // No appointments, so there is at least a 60-minute gap
          return true
        }

        const sortedAppointments = filteredAppointments
          .map((app) => ({
            appointmentStartTime: new Date(app.appointmentStartTime),
            appointmentEndTime: new Date(app.appointmentEndTime),
          }))
          .sort(
            (a, b) =>
              a.appointmentStartTime.getTime() -
              b.appointmentStartTime.getTime()
          )

        // Check gap before the first appointment
        const firstGap =
          sortedAppointments[0].appointmentStartTime.getTime() -
          availabilityStartTime.getTime()
        if (firstGap >= 60 * 60 * 1000) {
          return true
        }

        // Check gaps between appointments
        for (let i = 1; i < sortedAppointments.length; i += 1) {
          const previousEnd =
            sortedAppointments[i - 1].appointmentEndTime.getTime()
          const currentStart =
            sortedAppointments[i].appointmentStartTime.getTime()
          const gap = currentStart - previousEnd
          if (gap >= 60 * 60 * 1000) {
            return true
          }
        }

        // Check gap after the last appointment
        const lastGap =
          availabilityEndTime.getTime() -
          sortedAppointments[
            sortedAppointments.length - 1
          ].appointmentEndTime.getTime()
        if (lastGap >= 60 * 60 * 1000) {
          return true
        }

        // No gap found
        return false
      }

      while (foundSpecialists.length < endIndex) {
        const potentialSpecialists = await getPotentialSpecialists(
          offset,
          limit
        )
        if (potentialSpecialists.length === 0) {
          break // No more specialists to process
        }

        for (const specialist of potentialSpecialists) {
          const appointments = await getSpecialistAppointments(
            specialist.specialistId
          )

          const hasGap = hasSixtyMinuteGap(
            appointments,
            specialist.startTime,
            specialist.endTime
          )

          if (hasGap) {
            const specialistSchedule = await getSpecialistSchedule(
              specialist.specialistId
            )
            const businessSchedule = await getBusinessOperationalHours(
              specialist.businessId
            )

            const workingHours = computeOverlappingWorkingHours(
              specialistSchedule,
              businessSchedule
            )

            // Construct bookings object
            const bookings: Record<string, { start: string; end: string }[]> =
              {}

            for (const appointment of appointments) {
              const appointmentDate = new Date(appointment.appointmentStartTime)
                .toISOString()
                .split('T')[0]

              if (!bookings[appointmentDate]) {
                bookings[appointmentDate] = []
              }

              bookings[appointmentDate].push({
                start: new Date(appointment.appointmentStartTime)
                  .toISOString()
                  .split('T')[1]
                  .slice(0, 8),
                end: new Date(appointment.appointmentEndTime)
                  .toISOString()
                  .split('T')[1]
                  .slice(0, 8),
              })
            }

            // Construct the specialist object
            const specialistData = {
              specialistId: specialist.specialistId,
              businessId: specialist.businessId,
              address: specialist.address,
              city: specialist.city,
              businessName: specialist.businessName,
              businessEmail: specialist.businessEmail,
              businessPhoneNumber: specialist.businessPhoneNumber,
              postalCode: specialist.postalCode,
              businessSpecialityId: specialist.businessSpecialityId,
              specialityName: specialist.specialityName,
              price: specialist.price,
              specialistFirstName: specialist.specialistFirstName,
              specialistLastName: specialist.specialistLastName,
              workingHours,
              bookings,
            }

            foundSpecialists.push(specialistData)

            // If we've collected enough specialists, break the loop
            if (foundSpecialists.length >= endIndex) {
              break
            }
          }
        }

        offset += limit // Increment offset to fetch next set of specialists
      }

      // Return the specialists for the requested page
      if (foundSpecialists.length <= startIndex) {
        return [] // Not enough specialists to cover this page
      }
      return foundSpecialists.slice(startIndex, endIndex)
    },
  }
}
export type AppointmentRepository = ReturnType<typeof appointmentRepository>
