import t from '@server/trpc'
import addRegisteredUserAppointment from './addRegisteredAppointment'
import addPublicAppointment from './addPublicAppointment'
import addBusiness from './addBusiness'
import addBusinessSpeciality from './addBusinessSpeciality'
import addBusinessHours from './addBusinessHours'
import addEmployee from './addEmployee'
import getBusinessesByTitle from './getBusinessesByTitle'
import getBusinessesByService from './getBusinessesByService'
import deleteEmployee from './deleteEmployee'
import editBusiness from './editBusiness'

export default t.router({
  addRegisteredUserAppointment,
  addPublicAppointment,
  addBusiness,
  addBusinessSpeciality,
  addBusinessHours,
  addEmployee,
  getBusinessesByTitle,
  getBusinessesByService,
  deleteEmployee,
  editBusiness
})
