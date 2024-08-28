import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'
import z from 'zod'

export default authenticatedProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .input(z.object({businessId: z.number().int().positive()}))
  .use(
    async ({
      input: { businessId },
      ctx: { repositories, authUser },
      next,
    }) => {
      // is business of user?
      const userBusinesses =
        await repositories.businessRepository.get_businesses_by_registered_user_id(
          authUser.id
        )

      const userBusiness = userBusinesses.find(
        (business) => business.id === businessId
      )
      if (!userBusiness) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The server cannot find the requested business.',
        })
      }
      return next()
    }
  )
