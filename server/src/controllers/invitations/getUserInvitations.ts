import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    return await repositories.businessRepository.getUsersInvitations(
      authUser.id
    )
  })
