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
  .input(z.object({ businessId: z.number().int().positive() }))
  .use(
    async ({
      input: { businessId },
      ctx: { repositories, authUser },
      next,
    }) => {
      // is business of user?
      const userBusiness =
        await repositories.businessRepository.getUserBusinessesByBusinessId(
          authUser.id,
          businessId
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
