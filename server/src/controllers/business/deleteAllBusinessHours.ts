import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .mutation(async ({ input: { businessId }, ctx: { repositories } }) => {
    const deleted =
      await repositories.businessRepository.deleteAllBusinessHours(businessId)

    return deleted
  })
