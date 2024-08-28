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
      const allSpecialities =
        await repositories.specialityRepository.get_all_specialities()

      const foundSpeciality = allSpecialities.find(
        (s) => s.speciality === specialityName
      )

      if (!foundSpeciality) {
        const specialityNames = allSpecialities.map((s) => s.speciality)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid. Speciality must be one of: ${specialityNames}`,
        })
      }

      // is speciality already assigned to business?
      const businessSpecialities =
        await repositories.specialityRepository.get_business_specalities_by_business_id(
          businessId
        )

      const assignedSpeciality = businessSpecialities.find(
        (s) => s.specialityId === foundSpeciality.id
      )

      if (assignedSpeciality) {
        return { message: 'Speciality already assigned to business' }
      }

      const newSpeciality =
        await repositories.specialityRepository.add_business_speciality(
          businessId,
          foundSpeciality.id,
          price
        )

      return newSpeciality
    }
  )
