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
    const specialities = (
      await repositories.specialityRepository.getUsersSpecalities(authUser.id)
    ).map((s) => s.speciality)

    return specialities
  })
