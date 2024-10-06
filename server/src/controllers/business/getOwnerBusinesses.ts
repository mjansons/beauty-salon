import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .query(async ({ctx: { repositories, authUser } }) => {
    const businesses =
      await repositories.businessRepository.getOwnerBusinesses(authUser.id)

    return businesses
  })
