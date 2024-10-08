import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import z from 'zod'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .input(z.object({ specialityName: z.string() }))
  .mutation(
    async ({
      input: { businessId, specialityName },
      ctx: { repositories },
    }) => {
      // is that a real speciality?
      const foundSpeciality =
        await repositories.specialityRepository.getSpecialityByName(
          specialityName
        )

      if (!foundSpeciality) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid speciality.`,
        })
      }

      const deleted =
        await repositories.specialityRepository.deleteBusinessSpeciality(
          businessId,
          foundSpeciality.id
        )

      return deleted
    }
  )
