import t from '@server/trpc'
import addRegisteredUserAppointment from './addRegisteredAppointment'
import addPublicAppointment from './addPublicAppointment'
import addBusiness from './addBusiness'
import addBusinessSpeciality from './addBusinessSpeciality'
import addBusinessHours from './addBusinessHours'
import addEmployee from './acceptInvitation'
import getBusinessesByTitle from './getBusinessesByTitle'
import getBusinessesByService from './getBusinessesByService'
import deleteEmployee from './deleteEmployee'
import editBusiness from './editBusiness'
import getAllSpecialities from './getAllSpecialities'
import inviteEmployee from './inviteEmployee'
import acceptInvitation from './acceptInvitation'
import deleteInvitation from './deleteInvitation'

export default t.router({
  addRegisteredUserAppointment,
  addPublicAppointment,
  addBusiness,
  addBusinessSpeciality,
  addBusinessHours,
  addEmployee,
  getBusinessesByTitle,
  getBusinessesByService,
  getAllSpecialities,
  deleteEmployee,
  editBusiness,
  inviteEmployee,
  acceptInvitation,
  deleteInvitation
})
