import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import { businessUpdatingSchema } from '@server/schemas/businessSchema'
import { userRepository } from '@server/repositories/userRepository'
import { roleRepository } from '@server/repositories/roleRepository'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      userRepository,
      roleRepository,
    })
  )
  .input(businessUpdatingSchema)
  .mutation(
    async ({
      input: {
        businessId,
        name,
        city,
        address,
        postalCode,
        email,
        phoneNumber,
      },
      ctx: { repositories, authUser },
    }) => {
      const updatedBusiness =
        await repositories.businessRepository.editBusiness(
          businessId,
          name,
          authUser.id,
          city,
          address,
          postalCode,
          email,
          phoneNumber
        )
      return updatedBusiness
    }
  )
