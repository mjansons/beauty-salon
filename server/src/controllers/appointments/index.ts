import t from '@server/trpc'
import getSlotInfo from './getSpecialistSlots'
import addRegisteredUserAppointment from '../appointments/addRegisteredAppointment'
import addPublicAppointment from '../appointments/addPublicAppointment'
import getSpecialistAppointments from './getSpecialistAppointments'

export default t.router({
  getSlotInfo,
  addRegisteredUserAppointment,
  addPublicAppointment,
  getSpecialistAppointments,
})
