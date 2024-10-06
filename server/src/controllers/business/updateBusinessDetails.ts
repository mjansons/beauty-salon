import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import { partialBusinessUpdateSchema } from '@server/schemas/businessSchema'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .input(partialBusinessUpdateSchema)
  .mutation(async ({ input, ctx: { repositories } }) => {
    const { businessId, ...updateData } = input
    const updatedBusiness =
      await repositories.businessRepository.updateBusinessById(
        input.businessId,
        updateData
      )
    return updatedBusiness
  })
