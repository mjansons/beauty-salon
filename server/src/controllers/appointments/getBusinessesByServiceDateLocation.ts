import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { appointmentRepository } from '@server/repositories/appointmentRepository'
import t from '@server/trpc'
import { z } from 'zod'

export default t.procedure
  .use(
    provideRepos({
      appointmentRepository,
    })
  )

  .input(
    z.object({
      location: z.string(),
      service: z.string(),
      date: z.string(),
      page: z.number().default(1),
    })
  )
  .mutation(
    async ({
      input: { location, service, date, page },
      ctx: { repositories },
    }) => {
      try {
        const businesses =
          await repositories.appointmentRepository.getBusinessesByServiceDateLocation(
            location,
            service,
            date,
            page
          )
        return businesses
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `${error}`,
        })
      }
    }
  )
