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
      const employee =
        await repositories.specialityRepository.getSpecialistByEmail(
          employeeEmail
        )

      if (!employee) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Invalid. Specialist with the provided email, not found.`,
        })
      }

      try {
        const newEmployee = await repositories.businessRepository.deleteEmplyee(
          businessId,
          employee.registeredUserId
        )

        return newEmployee
      } catch (error) {
        return {
          message: `There was an error while adding employee to db. ${error}`,
        }
      }
    }
  )
