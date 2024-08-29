import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import { BusinessUpdatingSchema } from '@server/schemas/businessSchema'
import { userRepository } from '@server/repositories/userRepository'
import { assertError } from '@server/utils/errors'
import { roleRepository } from '@server/repositories/roleRepository'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      userRepository,
      roleRepository,
    })
  )
  .input(BusinessUpdatingSchema)
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
        await repositories.businessRepository.edit_business(
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
