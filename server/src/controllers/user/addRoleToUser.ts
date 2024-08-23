import config from '@server/config'
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
  .input(z.object({ role: z.string().max(20) }))
  .mutation(async ({ input: { role }, ctx: { repositories, authUser } }) => {
    // check if that is a real role
    const roles = await repositories.roleRepository.get_role_types()

    const foundRoleType = roles.find((r) => r.role === role)

    if (foundRoleType === undefined) {
      const roleNames = roles.map((r) => r.role);
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Invalid. Role must be one of: ${roleNames}`,
      })
    }

    // check if user already has this role assigned
    const userRoles = await repositories.roleRepository.get_user_assigned_roles(
      authUser.id
    )
    const foundUserRole = userRoles.find((r) => r.roleId === foundRoleType.id)

    if (foundUserRole !== undefined) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Duplicate. User already has this role assigned.`,
      })
    }

    try {
      await repositories.roleRepository.add_role_to_user(
        authUser.id,
        foundRoleType.id
      )
      return { message: 'success' }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the user roles.',
        cause: error,
      })
    }
  })
