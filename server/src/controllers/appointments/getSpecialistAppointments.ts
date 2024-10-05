import provideRepos from '@server/trpc/provideRepos'
import { appointmentRepository } from '@server/repositories/appointmentRepository'
import authenticatedSpecialistProcedure from '@server/trpc/authenticatedSpecialistProcedure'

export default authenticatedSpecialistProcedure
  .use(
    provideRepos({
      appointmentRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    const now = new Date()
    const appointments =
      await repositories.appointmentRepository.getAppointmentsBySpecialistId(
        now,
        authUser.id
      )

    return appointments
  })
