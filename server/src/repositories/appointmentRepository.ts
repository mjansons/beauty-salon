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
          'registeredUsers.firstName as SpecialistFirstName',
          'registeredUsers.lastName as SpecialistLastName',
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
      const limit: number = 10
      const outerOffset: number = limit * (page - 1)
      const totalResults: number = limit * page
      let innerOffset: number = 0

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

      const queryDate = new Date(date)
      const endDate = new Date(queryDate) // Create a copy of startDate
      endDate.setDate(endDate.getDate() + 7)

      const dayOfWeek = queryDate.getDay()
      const foundSpecialists = []
      let potentialSpecialists: PotentialSpecialists[]
      async function getPotentialSpecialists() {
        const values = await db
          .selectFrom('specialists')
          .innerJoin(
            'registeredUsers',
            'registeredUsers.id',
            'specialists.registeredUserId'
          ) // specialist personal details
          .innerJoin(
            'specialities',
            'specialities.id',
            'specialists.specialityId'
          ) // speciality name
          .innerJoin(
            'businessEmployees',
            'businessEmployees.employeeId',
            'specialists.registeredUserId'
          ) // which business
          .innerJoin(
            'businesses',
            'businesses.id',
            'businessEmployees.businessId'
          ) // business details
          .innerJoin('businessSpecialities', (join) =>
            join
              .onRef('businessSpecialities.businessId', '=', 'businesses.id')
              .onRef(
                'businessSpecialities.specialityId',
                '=',
                'specialities.id'
              )
          ) // business speciality details
          .innerJoin(
            'specialistAvailability',
            'specialistAvailability.specialistId',
            'specialists.registeredUserId'
          ) // specialist work hours
          .where('businesses.city', '=', location)
          .where('specialities.speciality', '=', service)
          .where('specialistAvailability.dayOfWeek', '=', dayOfWeek)
          .where(
            // specialist has 60 mins between opening and closing hours
            sql<boolean>`(specialist_availability.end_time - specialist_availability.start_time) >= INTERVAL '60 minutes'`
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
          .orderBy('specialists.registeredUserId')
          .orderBy('specialists.createdAt', 'desc')
          .offset(innerOffset)
          .limit(limit)
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
          .selectFrom('userAppointments') // I will need the employee Ids of the business
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

        // eslint-disable-next-line no-restricted-syntax
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
          // I already checked 60min gap in db filter
          return true
        }
        const sortedAppointments = filteredAppointments.map((app) => ({
          appointmentStartTime: new Date(app.appointmentStartTime),
          appointmentEndTime: new Date(app.appointmentEndTime),
        }))

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

      do {
        // I get 10 specialists
        // eslint-disable-next-line no-await-in-loop
        potentialSpecialists = await getPotentialSpecialists()

        // eslint-disable-next-line no-continue
        if (potentialSpecialists.length < 1) continue

        // validate specialist
        // eslint-disable-next-line no-restricted-syntax
        for (const specialist of potentialSpecialists) {
          // eslint-disable-next-line no-await-in-loop
          const appointments = await getSpecialistAppointments(
            specialist.specialistId
          )

          // here I need to now find if there is a 60 min gap between the appointments on the specified day
          const hasGap = hasSixtyMinuteGap(
            appointments,
            specialist.startTime,
            specialist.endTime
          )

          if (hasGap) {
            // eslint-disable-next-line no-await-in-loop
            const specialistSchedule = await getSpecialistSchedule(
              specialist.specialistId
            )
            // Fetch business operational hours
            // eslint-disable-next-line no-await-in-loop
            const businessSchedule = await getBusinessOperationalHours(
              specialist.businessId
            )
            // Compute overlapping working hours
            const workingHours = computeOverlappingWorkingHours(
              specialistSchedule,
              businessSchedule
            )
            // Construct bookings object
            const bookings: Record<string, { start: string; end: string }[]> =
              {}

            // eslint-disable-next-line no-restricted-syntax
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

            // Add the specialist data to foundSpecialists
            foundSpecialists.push(specialistData)
          }
        }
        innerOffset += 10
      } while ( // I need to keep doing this until I get totalResults or less than 10 specialists are returned
        foundSpecialists.length !== totalResults &&
        getPotentialSpecialists.length === 10
      )

      // // if found specialists is less or equal than totalResults, I return []
      if (foundSpecialists.length <= outerOffset) return []

      // else I return foundSpecialists - outerOffset from the first foundBusinesses
      return foundSpecialists.slice(outerOffset)
    },
  }
}
export type AppointmentRepository = ReturnType<typeof appointmentRepository>
