import type { Database } from '@server/database'
import { sql } from 'kysely'
import type { DBAppointment } from '@server/schemas/appointmentSchema'

export function appointmentRepository(db: Database) {
  return {
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
        businessEmail: string
        businessPhoneNumber: string
        postalCode: string
        specialistId: number
        specialityId: number
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
        return await db
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
            'businesses.email as businessEmail',
            'businesses.phoneNumber as businessPhoneNumber',
            'businesses.postalCode',
            'specialists.registeredUserId as specialistId',
            'specialists.specialityId as specialityId',
            'specialities.speciality as specialityName',
            'businessSpecialities.price',
            'registeredUsers.firstName as specialistFirstName',
            'registeredUsers.lastName as specialistLastName',
            'specialistAvailability.startTime',
            'specialistAvailability.endTime',
          ])
          .distinctOn('specialists.registeredUserId')
          .offset(innerOffset)
          .limit(limit)
          .execute()
      }

      async function getSpecialistSchedule(specialistId: number) {
        return await db
          .selectFrom('specialistAvailability')
          .where('specialistId', '=', specialistId)
          .selectAll()
          .execute()
      }

      async function getSpecialistAppointments(
        specialistId: number
      ): Promise<DBAppointment[]> {
        return await db
          .selectFrom('userAppointments') // I will need the employee Ids of the business
          .where('specialistId', '=', specialistId)
          .where(sql`DATE(appointment_start_time)`, '>=', date)
          .where(sql`DATE(appointment_start_time)`, '<=', endDate)
          .orderBy('appointmentStartTime', `asc`)
          .selectAll()
          .execute()
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
        // I get 10 specialists
        potentialSpecialists = await getPotentialSpecialists()
        console.log('potentialSpecialists', potentialSpecialists.length)
        if (potentialSpecialists.length < 1) continue

        // validate specialist
        for (const specialist of potentialSpecialists) {
          console.log('specialist', specialist.specialityName)
          const appointments = await getSpecialistAppointments(
            specialist.specialistId
          )
          console.log('appointments', appointments)

          // here I need to now find if there is a 60 min gap between the appointments on the specified day
          const hasGap = hasSixtyMinuteGap(
            appointments,
            specialist.startTime,
            specialist.endTime
          )

          if (hasGap) {
            console.log('hasGap', hasGap)
            const schedule = await getSpecialistSchedule(
              specialist.specialistId
            )

            // Construct workingHours object
            const workingHours: Record<number, [string, string]> = {}
            for (const s of schedule) {
              workingHours[s.dayOfWeek] = [s.startTime, s.endTime]
            }

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
              businessEmail: specialist.businessEmail,
              businessPhoneNumber: specialist.businessPhoneNumber,
              postalCode: specialist.postalCode,
              specialityId: specialist.specialityId,
              specialityName: specialist.specialityName,
              price: specialist.price,
              specialistFirstName: specialist.specialistFirstName,
              specialistLastName: specialist.specialistLastName,
              workingHours: workingHours,
              bookings: bookings,
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

      console.log('foundSpecialists', foundSpecialists)
      // // if found specialists is less or equal than totalResults, I return []
      if (foundSpecialists.length <= outerOffset) return []

      // else I return foundSpecialists - outerOffset from the first foundBusinesses
      return foundSpecialists.slice(outerOffset)
    },
  }
}
export type AppointmentRepository = ReturnType<typeof appointmentRepository>
