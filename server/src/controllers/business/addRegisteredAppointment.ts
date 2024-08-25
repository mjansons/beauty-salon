import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import { businessRepository } from '@server/repositories/businessReporitory'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'
import { RegisteredAppointmentsSchema } from '@server/schemas/appointmentSchema'
import { isValidFutureDate } from '@server/utils/time'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
      specialityRepository,
      businessRepository
    })
  )
  .input(RegisteredAppointmentsSchema)
  .mutation(async ({ input: {
    businessId,
    businessSpecialityId,
    specialistId,
    appointmentStartTime,
    appointmentEndTime,
  }, ctx: { repositories, authUser } }) => {

    // throw error if the business doesnt offer such a service
    const businessSpeciality = await repositories.specialityRepository.get_business_specality_by_id(businessSpecialityId)
    if (!businessSpeciality) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid business speciality`,
      })
    }

    // throw error if the specialist is not part of the business
    const businessEmployees = await repositories.businessRepository.get_business_employees_by_business_id(businessId)
    const employee = businessEmployees.find((e)=>e.employeeId === specialistId)
    if (!employee) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Business does not have such employee: ${specialistId}`,
      })
    }

    // throw error if specialist is not specialised in this service
    const specialistSpecialisations = await repositories.specialityRepository.get_users_specalities(specialistId)
    const userSpeciality = specialistSpecialisations.find((s)=>s.id === businessSpeciality.specialityId)
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


    // throw error if not within business working hours
    const businessWorkingHours = await repositories.businessRepository.get_business_working_hours_by_id(businessId)
    // I will get:
    // startTime: '08:00:00',
    // endTime: '21:00:00'




    // throw error if not within specialists working hours




    // throw error if overlaps with specialists appointments




    // check if that is a real role

    // appointmentStartTime: true,
    // appointmentEndTime: true,

    // businessId: true,
    // serviceId: true,
    // specialistId: true,





    // if (foundRoleType === undefined) {
    //   const roleNames = roles.map((r) => r.role);
    //   throw new TRPCError({
    //     code: 'BAD_REQUEST',
    //     message: `Invalid. Role must be one of: ${roleNames}`,
    //   })
    // }

    // // check if user already has this role assigned
    // const userRoles = await repositories.roleRepository.get_user_assigned_roles(
    //   authUser.id
    // )
    // const foundUserRole = userRoles.find((r) => r.roleId === foundRoleType.id)

    // if (foundUserRole !== undefined) {
    //   throw new TRPCError({
    //     code: 'BAD_REQUEST',
    //     message: `Duplicate. User already has this role assigned.`,
    //   })
    // }

    // try {
    //   await repositories.roleRepository.add_role_to_user(
    //     authUser.id,
    //     foundRoleType.id
    //   )
    //   return { message: 'success' }
    // } catch (error) {
    //   throw new TRPCError({
    //     code: 'INTERNAL_SERVER_ERROR',
    //     message: 'An error occurred while updating the user roles.',
    //     cause: error,
    //   })
    // }
  })



import { Kysely, sql } from 'kysely';

