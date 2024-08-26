import t from '@server/trpc'
import addRegisteredUserAppointment from './addRegisteredAppointment'
import addPublicAppointment from './addPublicAppointment'

export default t.router({
  addRegisteredUserAppointment,
  addPublicAppointment,
})
