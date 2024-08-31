import { TRPCError } from '@trpc/server'
import provideRepos from '@server/trpc/provideRepos'
import { businessRepository } from '@server/repositories/businessRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'
import { newBusinessSpeciality } from '@server/schemas/businessSpecialitySchema'
import { specialityRepository } from '@server/repositories/specialityRepository'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      businessRepository,
      specialityRepository,
    })
  )
  .input(newBusinessSpeciality)
  .mutation(
    async ({
      input: { businessId, specialityName, price },
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

      // is speciality already assigned to business?
      const businessSpeciality =
        await repositories.specialityRepository.getBusinessSpecalitiesByBusinessIdAndSpecialityId(
          businessId,
          foundSpeciality.id
        )

      if (businessSpeciality) {
        return { message: 'Speciality already assigned to business' }
      }

      const newSpeciality =
        await repositories.specialityRepository.addBusinessSpeciality(
          businessId,
          foundSpeciality.id,
          price
        )

      return newSpeciality
    }
  )
