import { hash } from 'bcrypt'
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import { registeredUserSchema } from '@server/schemas/registeredUser'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    registeredUserSchema.pick({
      password: true,
    })
  )
  .mutation(
    async ({ input: { password }, ctx: { repositories, authUser } }) => {
      const user = await repositories.userRepository.findRegisteredUserById(
        authUser.id
      )

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'The server cannot find the requested resource.',
        })
      }

      const passwordHash = await hash(password, config.auth.passwordCost)

      try {
        await repositories.userRepository.updateRegisteredUserRow(
          authUser.id,
          'password',
          passwordHash
        )
        return { message: 'success' }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the password.',
          cause: error,
        })
      }
    }
  )
