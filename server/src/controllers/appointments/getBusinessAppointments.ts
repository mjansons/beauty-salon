import provideRepos from '@server/trpc/provideRepos'
import { appointmentRepository } from '@server/repositories/appointmentRepository'
import authenticatedOwnerProcedure from '@server/trpc/authenticatedOwnerProcedure'

export default authenticatedOwnerProcedure
  .use(
    provideRepos({
      appointmentRepository,
    })
  )
  .query(async ({ input: { businessId }, ctx: { repositories } }) => {
    const now = new Date()
    const appointments =
      await repositories.appointmentRepository.getBusinessAppointments(
        now,
        businessId
      )

    return appointments
  })
