import provideRepos from '@server/trpc/provideRepos'
import { appointmentRepository } from '@server/repositories/appointmentRepository'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .use(
    provideRepos({
      appointmentRepository,
    })
  )
  .query(async ({ ctx: { repositories, authUser } }) => {
    const now = new Date()
    const appointments =
      await repositories.appointmentRepository.getPersonalAppointments(now, authUser.id)

    return appointments
  })
