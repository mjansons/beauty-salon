import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'
import { businessRegistrationSchema } from '@server/schemas/businessSchema'
import { userRepository } from '@server/repositories/userRepository'
import { assertError } from '@server/utils/errors'
import { roleRepository } from '@server/repositories/roleRepository'

export default authenticatedProcedure
  .use(
    provideRepos({
      businessRepository,
      userRepository,
      roleRepository,
    })
  )
  .input(businessRegistrationSchema)
  .mutation(
    async ({
      input: { name, city, address, postalCode, email, phoneNumber },
      ctx: { repositories, authUser },
    }) => {
      const user = await repositories.userRepository.findRegisteredUserById(
        authUser.id
      )
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The server cannot find the requested user.',
        })
      }

      const businessCreated = await repositories.businessRepository
        .addBusiness(
          name,
          authUser.id,
          city,
          address,
          postalCode,
          email,
          phoneNumber
        )
        .catch((error: unknown) => {
          assertError(error)

          if (error.message.includes('duplicate key')) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Business with this name already exists',
              cause: error,
            })
          }
          throw error
        })

      // should add owner role to user if he doesnt have it already
      const foundUserRole =
        await repositories.roleRepository.getUserAssignedRoleByRoleId(
          authUser.id,
          3
        )

      if (!foundUserRole) {
        try {
          await repositories.roleRepository.addRoleToUser(authUser.id, 3)
        } catch (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Failed to assign owner role to the user.',
            cause: error,
          })
        }
      }

      return businessCreated
    }
  )
