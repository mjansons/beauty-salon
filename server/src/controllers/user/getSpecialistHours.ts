import provideRepos from '@server/trpc/provideRepos'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    const workTime = await repositories.specialityRepository.getSpecialistHours(
      authUser.id
    )
    return workTime
  })
