import t from '@server/trpc'
import acceptInvitation from '../invitations/acceptInvitation'
import deleteInvitation from '../invitations/deleteInvitation'
import inviteEmployee from '../invitations/inviteEmployee'
import getUserInvitations from './getUserInvitations'

export default t.router({
  acceptInvitation,
  deleteInvitation,
  inviteEmployee,
  getUserInvitations
})
