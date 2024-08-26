import { hash } from 'bcrypt'
import t from '@server/trpc'
import config from '@server/config'
import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { assertError } from '@server/utils/errors'
import { registeredUserSchema } from '@server/schemas/registeredUser'

export default t.procedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .input(
    registeredUserSchema.pick({
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
    })
  )
  .mutation(async ({ input: user, ctx: { repositories } }) => {
    const passwordHash = await hash(user.password, config.auth.passwordCost)

    const updatedUser = {
      ...user,
      email: user.email.toLowerCase().trim(),
      password: passwordHash,
    }

    const userCreated = await repositories.userRepository
      .create_registered_user({
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

    return {
      id: userCreated.id,
    }
  })
