import provideRepos from '@server/trpc/provideRepos'
import { specialityRepository } from '@server/repositories/specialityRepository'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure/index'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    return (
      await repositories.specialityRepository.getUsersSpecalities(authUser.id)
    ).map((s) => s.speciality)
  })
