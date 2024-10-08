import provideRepos from '@server/trpc/provideRepos'
import { specialityRepository } from '@server/repositories/specialityRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .query(async ({ input: { businessId }, ctx: { repositories } }) => {
    const specialities =
      await repositories.specialityRepository.getAllBusinessSpecialities(businessId)

    return specialities
  })
