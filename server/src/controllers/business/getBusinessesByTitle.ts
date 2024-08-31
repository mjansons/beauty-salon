import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import t from '@server/trpc/'
import z from 'zod'

export default t.procedure
  .use(
    provideRepos({
      businessRepository,
    })
  )
  .input(z.object({ searchTerm: z.string().trim().toLowerCase().min(3).max(50) }))
  .query(async ({ input: { searchTerm }, ctx: { repositories } }) => {
    const businesses =
      await repositories.businessRepository.getBusinessesByTitle(searchTerm)

    return businesses
  })
