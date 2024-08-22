import t from '@server/trpc'
import login from './login'
import signup from './signup'

export default t.router({
  login,
  signup,
})
