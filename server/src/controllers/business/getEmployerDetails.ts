import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    const businesses =
      await repositories.businessRepository.getBusinessByEmployeeId(authUser.id)

    return businesses
  })
