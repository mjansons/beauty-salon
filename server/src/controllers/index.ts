import t from '../trpc'
import user from './user'

export const appRouter = t.router({
  user,
})

export type AppRouter = typeof appRouter
