import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import t from '@server/trpc/'

export default t.procedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .query(async ({ ctx: { repositories } }) => {
    const allCities = await repositories.businessRepository.getAllCities()

    return allCities
  })
