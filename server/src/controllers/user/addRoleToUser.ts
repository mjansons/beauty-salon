import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { roleRepository } from '@server/repositories/roleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
      roleRepository,
    })
  )
  .input(z.object({ role: z.string().trim().toLowerCase().max(20) }))
  .mutation(async ({ input: { role }, ctx: { repositories, authUser } }) => {
    // check if that is a real role
    const foundRole = await repositories.roleRepository.getRoleByName(role)

    if (!foundRole) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid role.`,
      })
    }

    // check if user already has this role assigned
    const userRole = await repositories.roleRepository.getRoleByUserIdAndRoleId(
      authUser.id,
      foundRole.id
    )

    if (userRole) {
      return { message: 'Role already assigned' }
    }

    try {
      await repositories.roleRepository.addRoleToUser(authUser.id, foundRole.id)
      return { message: 'success' }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user roles.',
        cause: error,
      })
    }
  })
