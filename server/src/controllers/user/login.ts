import bcrypt from 'bcrypt'
import config from '@server/config'
import jsonwebtoken from 'jsonwebtoken'
import t from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { registeredUserSchema } from '@server/schemas/registeredUser'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { prepareTokenPayload } from '@server/trpc/tokenPayload'

const { expiresIn, tokenKey } = config.auth

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
    })
  )
  .mutation(async ({ input: { email, password }, ctx: { repositories } }) => {
    const user =
      await repositories.userRepository.findRegisteredUserByEmail(email)

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'We could not find an account with this email address',
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Please try again.',
      })
    }

    // What we will include in the token.
    const payload = prepareTokenPayload(user)

    const accessToken = jsonwebtoken.sign(payload, tokenKey, {
      expiresIn,
    })

    return {
      accessToken,
      isOnboarded: user.isOnboarded
    }
  })
