import type { Database } from '@server/database'
import { sql } from 'kysely'
import { type BusinessSchema } from '@server/schemas/businessSchema'
import type { Appointments } from '@server/schemas/appointmentSchema'

export function appointmentRepository(db: Database) {
  return {
    async getBusinessesByServiceDateLocation(
      location: string,
      service: string,
      date: string, // YYYY-MM-DD
      page: number
    ): Promise<BusinessSchema[]> {
      const limit: number = 10
      const outerOffset: number = limit * (page - 1)
      const totalResults: number = limit * page
      let innerOffset: number = 0

      const queryDate = new Date(date)
      const dayOfWeek = queryDate.getDay()
      const foundBusinesses: BusinessSchema[] = []
      let potentialBusinesses: BusinessSchema[]
      async function getBusinesses() {
        return await db
          .selectFrom('businesses')
          .innerJoin(
            // business specialities
            'businessSpecialities',
            'businessSpecialities.businessId',
            'businesses.id'
          )
          .innerJoin(
            // speciality names
            'specialities',
            'specialities.id',
            'businessSpecialities.specialityId'
          )
          .innerJoin(
            // business work hours and days
            'businessAvailability',
            'businessAvailability.businessId',
            'businesses.id'
          )
          // fist check if business is in the location
          .where('businesses.city', '=', location)

          // second if the business has the service
          .where('specialities.speciality', '=', service)

          // third I need to check:
          .where('businessAvailability.dayOfWeek', '=', dayOfWeek) // if business works on that day
          .where(
            // business has 60 mins between opening and closing hours
            sql<boolean>`(business_availability.end_time - business_availability.start_time) >= INTERVAL '60 minutes'`
          )
          .distinct()
          .select([
            `businesses.id`,
            'businesses.name',
            'businesses.ownerId',
            'businesses.city',
            'businesses.address',
            'businesses.postalCode',
            'businesses.email',
            'businesses.phoneNumber',
            'businesses.createdAt',
          ])
          .offset(innerOffset)
          .limit(limit)
          .execute()
      }

      async function getEmployeesByBusinessId(businessId: number) {
        return await db
          .selectFrom('businessEmployees') // I will need the employee Ids of the business
          .innerJoin(
            'registeredUsers',
            'registeredUsers.id',
            'businessEmployees.employeeId'
          )
          .innerJoin(
            'specialists',
            'specialists.registeredUserId',
            'businessEmployees.employeeId'
          )
          .innerJoin(
            'specialities',
            'specialities.id',
            'specialists.specialityId'
          )
          .innerJoin(
            'specialistAvailability',
            'specialistAvailability.specialistId',
            'businessEmployees.employeeId'
          )
          .where('businessEmployees.businessId', '=', businessId)
          .where('specialities.speciality', '=', service)
          .where('specialistAvailability.dayOfWeek', '=', dayOfWeek)
          .where(
            sql<boolean>`(specialist_availability.end_time - specialist_availability.start_time) >= INTERVAL '60 minutes'`
          )
          .select([
            'businessEmployees.employeeId',
            'specialistAvailability.dayOfWeek',
            'specialists.specialityId',
            'specialistAvailability.startTime',
            'specialistAvailability.endTime',
          ])
          .execute()
      }

      async function getEmployeeAppointmentsOnDay(
        employeeId: number
      ): Promise<Appointments[]> {
        return await db
          .selectFrom('userAppointments') // I will need the employee Ids of the business
          .where('specialistId', '=', employeeId)
          .where(sql`DATE(appointment_start_time)`, '=', date)
          .orderBy('appointmentStartTime', `asc`)
          .selectAll()
          .execute()
      }

      function hasSixtyMinuteGap(
        appointments: Appointments[],
        availabilityStart: string,
        availabilityEnd: string
      ): boolean {
        const availabilityStartTime = new Date(`${date}T${availabilityStart}`)
        const availabilityEndTime = new Date(`${date}T${availabilityEnd}`)

        const sortedAppointments = appointments.map((app) => ({
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
        for (let i = 1; i < sortedAppointments.length; i++) {
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
        // I get 10 businessses
        potentialBusinesses = await getBusinesses()
        console.log(
          `raw businesses: ${JSON.stringify(potentialBusinesses, null, 2)}`
        )
        if (potentialBusinesses.length < 1) continue

        // validate businesses
        for (const business of potentialBusinesses) {
          const employees = await getEmployeesByBusinessId(business.id)
          if (employees.length < 1) continue

          for (const employee of employees) {
            const employeeAppointments = await getEmployeeAppointmentsOnDay(
              employee.employeeId
            )
            if (employeeAppointments.length < 1) {
              // Add the business to foundBusinesses
              foundBusinesses.push(business)
              break
            }

            // here I need to now find if there is a 60 min gap between the appointments
            const hasGap = hasSixtyMinuteGap(
              employeeAppointments,
              employee.startTime,
              employee.endTime
            )

            if (hasGap) {
              // Add the business to foundBusinesses
              foundBusinesses.push(business)
              break
            }
          }
        }

        // when the loop is over, I add innerOffset by 10
        innerOffset += 10
      } while ( // I need to keep doing this until I get totalResults or less than 10 buisenesses are returned
        foundBusinesses.length !== totalResults &&
        potentialBusinesses.length === 10
      )

      console.log('found businessses', foundBusinesses, foundBusinesses.length)
      // if found businesses is less or equal than totalResults, I return []
      if (foundBusinesses.length <= outerOffset) return []

      // else I return foundBusinesses - outerOffset from the first foundBusinesses
      return foundBusinesses.slice(outerOffset)
    },
  }
}

export type UserRepository = ReturnType<typeof appointmentRepository>
