import t from '../trpc'
import user from './user'
import business from './business'

export const appRouter = t.router({
  user,
  business,
})

export type AppRouter = typeof appRouter
