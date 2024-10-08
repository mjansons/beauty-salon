import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'

import z from 'zod'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .input(z.object({ employeeEmail: z.string().trim().toLowerCase().email() }))
  .mutation(
    async ({ input: { businessId, employeeEmail }, ctx: { repositories } }) => {
      // is it a real specialist?
      let employee
      try {
        employee =
          await repositories.specialityRepository.getSpecialistByEmail(
            employeeEmail
          )
      } catch (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invalid. Specialist with the provided email, not found. ${error}`,
        })
      }

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invalid. Specialist with the provided email, not found.`,
        })
      }

      try {
        const invitation =
          await repositories.businessRepository.createInvitation({
            businessId,
            employeeId: employee.registeredUserId,
          })

        return invitation
      } catch (error) {
        if ((error as Error).message.includes('duplicate key')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Invitation already exists for this specialist.`,
          })
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `An unexpected error occurred. ${error}`,
          })
        }
      }
    }
  )
