import t from '@server/trpc'
import deleteInvitation from "./deleteInvitation"
import inviteEmployee from "./inviteEmployee"
import acceptInvitation from "./acceptInvitation"
import getUserInvitations from './getUserInvitations'

export default t.router({
  acceptInvitation,
  deleteInvitation,
  inviteEmployee,
  getUserInvitations,
})
