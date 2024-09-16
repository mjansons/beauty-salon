import t from '../trpc'
import user from './user'
import business from './business'
import appointments from './appointments'
import invitations from './invitations'

export const appRouter = t.router({
  user,
  business,
  appointments,
  invitations
})

export type AppRouter = typeof appRouter
