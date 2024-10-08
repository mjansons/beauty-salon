import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .query(async ({ input: { businessId }, ctx: { repositories } }) => {
    const hours =
      await repositories.businessRepository.getAllBusinessHours(businessId)

    return hours
  })
