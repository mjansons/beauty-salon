import t from '@server/trpc'
import addRegisteredUserAppointment from './addRegisteredAppointment'
import addPublicAppointment from './addPublicAppointment'
import addBusiness from './addBusiness'

export default t.router({
  addRegisteredUserAppointment,
  addPublicAppointment,
  addBusiness
})
