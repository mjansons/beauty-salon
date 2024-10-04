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
  .input(z.object({ speciality: z.string().trim().toLowerCase().max(50) }))
  .mutation(
    async ({ input: { speciality }, ctx: { repositories, authUser } }) => {
      // check if that is a real speciality

      const foundSpeciality =
        await repositories.specialityRepository.getSpecialityByName(speciality)

      if (!foundSpeciality) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid speciality`,
        })
      }

      // check if user already has this speciality assigned
      const foundUserSpeciality =
        await repositories.specialityRepository.getUsersSpecalityByName(
          authUser.id,
          speciality
        )

      if (!foundUserSpeciality) {
        return { message: 'User already doesnt have this speciality.' }
      }

      try {
        await repositories.specialityRepository.removeSpecialist(
          authUser.id,
          foundSpeciality.id
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
