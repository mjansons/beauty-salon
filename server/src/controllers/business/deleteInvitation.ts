import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'
import z from 'zod'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .input(z.object({ businessId: z.number().positive().int() }))
  .mutation(
    async ({ input: { businessId }, ctx: { repositories, authUser } }) => {
      // just need to check if the invite exists

      const invite = await repositories.businessRepository.findInvitation({
        businessId: businessId,
        employeeId: authUser.id,
      })

      if (!invite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invite not found.`,
        })
      }

      try {
        // if it does, delete it from invitations table
        const deletedInvitation =
          await repositories.businessRepository.deleteInvitation({
            businessId: businessId,
            employeeId: authUser.id,
          })

        return deletedInvitation
      } catch (error) {
        return {
          message: `There was an error while adding new employee to db. ${error}`,
        }
      }
    }
  )
