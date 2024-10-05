import t from '@server/trpc'

import addBusiness from './addBusiness'
import addBusinessSpeciality from './addBusinessSpeciality'
import addBusinessHours from './addBusinessHours'
import addEmployee from '../invitations/acceptInvitation'
import getBusinessesByTitle from './getBusinessesByTitle'
import getBusinessesByService from './getBusinessesByService'
import deleteEmployee from './deleteEmployee'
import editBusiness from './editBusiness'
import getAllSpecialities from './getAllSpecialities'
import getAllCities from './getAllCities'

export default t.router({
  addBusiness,
  addBusinessSpeciality,
  addBusinessHours,
  addEmployee,
  getBusinessesByTitle,
  getBusinessesByService,
  getAllSpecialities,
  deleteEmployee,
  editBusiness,
  getAllCities,
})
