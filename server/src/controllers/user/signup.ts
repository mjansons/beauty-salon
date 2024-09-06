import { hash } from 'bcrypt'
import t from '@server/trpc'
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { roleRepository } from '@server/repositories/roleRepository'
import { assertError } from '@server/utils/errors'
import { signupSchema } from '@server/schemas/registeredUser'

export default t.procedure
  .use(
    provideRepos({
      userRepository,
      roleRepository,
    })
  )
  .input(signupSchema)
  .mutation(async ({ input: user, ctx: { repositories } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost)

    const updatedUser = {
      ...user,
      email: user.email.toLowerCase().trim(),
      password: passwordHash,
    }

    const userCreated = await repositories.userRepository
      .createRegisteredUser({
        ...updatedUser,
      })
      .catch((error: unknown) => {
        assertError(error)

        if (error.message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User with this email already exists',
            cause: error,
          })
        }
        throw error
      })

    try {
      await repositories.roleRepository.addRoleToUser(userCreated.id, 1)
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to assign client role to the user.',
        cause: error,
      })
    }

    return {
      id: userCreated.id,
    }
  })
