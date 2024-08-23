import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import provideRepos from '@server/trpc/provideRepos'
import { userRepository } from '@server/repositories/userRepository'
import { specialityRepository } from '@server/repositories/specialityRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure/index'

export default authenticatedProcedure
  .use(
    provideRepos({
      userRepository,
      specialityRepository,
    })
  )
  .input(z.object({ speciality: z.string().max(50) }))
  .mutation(
    async ({ input: { speciality }, ctx: { repositories, authUser } }) => {
      // check if that is a real speciality
      const specialities =
        await repositories.specialityRepository.get_all_specialities()
      const foundSpecialities = specialities.find(
        (s) => s.speciality === speciality
      )

      if (foundSpecialities === undefined) {
        const specialityNames = specialities.map((s) => s.speciality)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid. Speciality must be one of: ${specialityNames}`,
        })
      }

      // check if user already has this speciality assigned
      const userSpecialities =
        await repositories.specialityRepository.get_users_specalities(
          authUser.id
        )
      const foundUserSpeciality = userSpecialities.find(
        (s) => s.id === foundSpecialities.id
      )

      if (foundUserSpeciality !== undefined) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Duplicate. User already has this speciality assigned.`,
        })
      }

      try {
        await repositories.specialityRepository.add_specialist(
          authUser.id,
          foundSpecialities.id
        )
        return { message: 'success' }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the specialist table.',
          cause: error,
        })
      }
    }
  )
