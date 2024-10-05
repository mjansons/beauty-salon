import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    const roles = await repositories.userRepository.getUserRoles(authUser.id)
    return roles
  })
