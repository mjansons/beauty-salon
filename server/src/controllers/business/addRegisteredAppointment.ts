import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import { businessRepository } from '@server/repositories/businessReporitory'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'
import { RegisteredAppointmentsSchema } from '@server/schemas/appointmentSchema'
import {
  isValidFutureDate,
  isWithinTimeRange,
  getDayOfWeek,
} from '@server/utils/time'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
      specialityRepository,
      businessRepository,
    })
  )
  .input(RegisteredAppointmentsSchema)
  .mutation(
    async ({
      input: {
        businessId,
        businessSpecialityId,
        specialistId,
        appointmentStartTime,
        appointmentEndTime,
      },
      ctx: { repositories, authUser },
    }) => {
      // throw error if the business doesnt offer such a service
      const businessSpeciality =
        await repositories.specialityRepository.get_business_specality_by_id(
          businessSpecialityId
        )
      if (!businessSpeciality) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid business speciality`,
        })
      }

      // throw error if the specialist is not part of the business
      const businessEmployees =
        await repositories.businessRepository.get_business_employees_by_business_id(
          businessId
        )
      const employee = businessEmployees.find(
        (e) => e.employeeId === specialistId
      )
      if (!employee) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Business does not have such employee: ${specialistId}`,
        })
      }

      // throw error if specialist is not specialised in this service
      const specialistSpecialisations =
        await repositories.specialityRepository.get_users_specalities(
          specialistId
        )
      const userSpeciality = specialistSpecialisations.find(
        (s) => s.id === businessSpeciality.specialityId
      )
      if (!userSpeciality) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Specialist has not specialised in this service.`,
        })
      }

      // throw error if scheduling for a past date
      if (!isValidFutureDate(appointmentStartTime)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot make an appointment earlier than 1h from now.`,
        })
      }

      // throw error if not within business working time, i.e.:
      const businessAvailability =
        await repositories.businessRepository.get_business_availability_by_id(
          businessId
        )

      // not within working day
      const appointmentDay = getDayOfWeek(appointmentStartTime)
      const businessWorkingDays = businessAvailability.map(
        (day) => day.dayOfWeek
      )
      const indexOfWorkingDay = businessAvailability.findIndex(
        (day) => day.dayOfWeek === appointmentDay
      )

      if (!businessWorkingDays.includes(appointmentDay)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Business not operational on this day`,
        })
      }

      // not within time range
      const inBusinessHours = isWithinTimeRange(
        appointmentStartTime,
        appointmentEndTime,
        businessAvailability[indexOfWorkingDay].startTime,
        businessAvailability[indexOfWorkingDay].endTime
      )

      if (!inBusinessHours) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Business not operational on within these hours`,
        })
      }

      // throw error if not within specialists working time, i.e:
      const specialistAvailability =
        await repositories.businessRepository.get_specialist_availability_by_id(
          specialistId
        )

      // not within working day
      const specialistWorkingDays = specialistAvailability.map(
        (day) => day.dayOfWeek
      )
      const indexOfSpecialistWorkingDay = specialistAvailability.findIndex(
        (day) => day.dayOfWeek === appointmentDay
      )

      if (!specialistWorkingDays.includes(appointmentDay)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Specialist not working on this day`,
        })
      }

      // not within working hours
      const inSpecialistsHours = isWithinTimeRange(
        appointmentStartTime,
        appointmentEndTime,
        specialistAvailability[indexOfSpecialistWorkingDay].startTime,
        specialistAvailability[indexOfSpecialistWorkingDay].endTime
      )

      if (!inSpecialistsHours) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Specialist not working within these hours`,
        })
      }

      // throw error if overlaps with specialists appointments
      const userAppointments =
        await repositories.businessRepository.get_specialist_appointments_by_time(
          specialistId,
          appointmentStartTime,
          appointmentEndTime
        )

      if (userAppointments.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Specialist is already booked during the specified time`,
        })
      }

      try {
        const newAppointment =
          await repositories.businessRepository.add_appointment(
            authUser.id,
            authUser.firstName,
            authUser.lastName,
            authUser.email,
            authUser.phoneNumber,
            businessId,
            businessSpecialityId,
            specialistId,
            appointmentStartTime,
            appointmentEndTime
          )

        return newAppointment
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the userAppointments.',
          cause: error,
        })
      }
    }
  )
