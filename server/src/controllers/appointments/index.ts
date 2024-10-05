import t from '@server/trpc'
import addRegisteredUserAppointment from "./addRegisteredAppointment"
import addPublicAppointment from "./addPublicAppointment"
import getSlotInfo from './getSpecialistSlots'
import getSpecialistAppointments from './getSpecialistAppointments'

export default t.router({
  getSlotInfo,
  addRegisteredUserAppointment,
  addPublicAppointment,
  getSpecialistAppointments,
})
