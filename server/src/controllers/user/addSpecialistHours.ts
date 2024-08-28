import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'
import { NewSpecialistDaySchema } from '@server/schemas/specialistAvailabilitySchema'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .input(NewSpecialistDaySchema)
  .mutation(
    async ({
      input: { dayOfWeek, startTime, endTime },
      ctx: { repositories, authUser },
    }) => {
      // is the end time after start time?
      const startDate = new Date(`2020-01-01T${startTime}`)
      const endDate = new Date(`2020-01-01T${endTime}`)
      if (startDate >= endDate) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `End time has to come after start time`,
        })
      }

      // has the specialist any specialities?
      const userSpecialities =
        await repositories.specialityRepository.get_users_specalities(
          authUser.id
        )

      if (userSpecialities.length === 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `User hasnt specialised in anything yet.`,
        })
      }

      try {
        const newDay =
          await repositories.specialityRepository.add_specialist_hours_to_day(
            authUser.id,
            dayOfWeek,
            startTime,
            endTime
          )

        return newDay
      } catch (error) {
        return {
          message: `There was an error while adding hours to db. ${error}`,
        }
      }
    }
  )
