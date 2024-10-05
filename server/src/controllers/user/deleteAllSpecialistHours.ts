import provideRepos from '@server/trpc/provideRepos'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .mutation(async ({ ctx: { repositories, authUser } }) => {
    await repositories.specialityRepository.deleteAllSpecialistWorkDays(
      authUser.id
    )
  })
