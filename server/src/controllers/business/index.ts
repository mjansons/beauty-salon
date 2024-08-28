import t from '@server/trpc'
import addRegisteredUserAppointment from './addRegisteredAppointment'
import addPublicAppointment from './addPublicAppointment'
import addBusiness from './addBusiness'
import addBusinessSpeciality from './addBusinessSpeciality'
import addBusinessHours from './addBusinessHours'

export default t.router({
  addRegisteredUserAppointment,
  addPublicAppointment,
  addBusiness,
  addBusinessSpeciality,
  addBusinessHours
})
