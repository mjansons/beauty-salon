import { TRPCError } from '@trpc/server'
import { updateUserSchema } from '@server/schemas/registeredUser'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(updateUserSchema)
  .mutation(async ({ input, ctx: { repositories, authUser } }) => {
    const updatedUser =
      await repositories.userRepository.updateRegisteredUserById(authUser.id, {
        ...input,
      })

    if (!updatedUser) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user.',
      })
    }
    return updatedUser
  })
