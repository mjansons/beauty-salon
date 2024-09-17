import t from '@server/trpc'
import getSlotInfo from './getSpecialistSlots'
import addRegisteredUserAppointment from '../appointments/addRegisteredAppointment'
import addPublicAppointment from '../appointments/addPublicAppointment'

export default t.router({
  getSlotInfo,
  addRegisteredUserAppointment,
  addPublicAppointment
})
