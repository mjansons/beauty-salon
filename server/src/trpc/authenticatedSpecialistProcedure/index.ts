import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { roleRepository } from '@server/repositories/roleRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      roleRepository,
    })
  )
  .use(async ({ ctx: { repositories, authUser }, next }) => {
    // is user a specialist?
    const userRole = await repositories.roleRepository.getUserAssignedRoleByRoleId(
      authUser.id,
      2
    )

    if (!userRole) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The user does not have a specialist role',
      })
    }
    return next()
  })
