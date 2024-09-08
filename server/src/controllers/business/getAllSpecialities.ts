import provideRepos from '@server/trpc/provideRepos'
import { specialityRepository } from '@server/repositories/specialityRepository'
import t from '@server/trpc/'

export default t.procedure
  .use(
    provideRepos({
      specialityRepository,
    })
  )
  .query(async ({ctx: { repositories } }) => {
    const allSpecialities =
      await repositories.specialityRepository.getAllSpecialities()

    return allSpecialities
  })
