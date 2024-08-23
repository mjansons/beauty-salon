import t from '@server/trpc'
import login from './login'
import signup from './signup'
import resetPassword from './resetPassword'

export default t.router({
  login,
  signup,
  resetPassword
})
