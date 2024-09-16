import t from '@server/trpc'
import getBusinessesByServiceDateLocation from './getBusinessesByServiceDateLocation'
import addRegisteredUserAppointment from '../appointments/addRegisteredAppointment'
import addPublicAppointment from '../appointments/addPublicAppointment'

export default t.router({
  getBusinessesByServiceDateLocation,
  addRegisteredUserAppointment,
  addPublicAppointment
})
