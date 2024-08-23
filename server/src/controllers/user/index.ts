import t from '@server/trpc'
import login from './login'
import signup from './signup'
import changePassword from './changePassword'
import addRoleToUser from './addRoleToUser'

export default t.router({
  login,
  signup,
  changePassword,
  addRoleToUser
})
