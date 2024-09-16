import t from '../trpc'
import user from './user'
import business from './business'
import appointments from './appointments'

export const appRouter = t.router({
  user,
  business,
  appointments
})

export type AppRouter = typeof appRouter
