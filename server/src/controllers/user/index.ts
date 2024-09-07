import t from '@server/trpc'
import login from './login'
import signup from './signup'
import changePassword from './changePassword'
import addRoleToUser from './addRoleToUser'
import addSpecialityToUser from './addSpecialityToUser'
import addSpecialistHours from './addSpecialistHours'
import updateUserDetails from './updateUserDetails'

export default t.router({
  login,
  signup,
  changePassword,
  addRoleToUser,
  addSpecialityToUser,
  addSpecialistHours,
  updateUserDetails
})
