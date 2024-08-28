import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import { NewBusinessDaySchema } from '@server/schemas/businessAvailabilitySchema'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .input(NewBusinessDaySchema)
  .mutation(
    async ({
      input: { businessId, dayOfWeek, startTime, endTime },
      ctx: { repositories },
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

      try {
        const newDay =
          await repositories.businessRepository.add_business_hours_to_day(
            businessId,
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
