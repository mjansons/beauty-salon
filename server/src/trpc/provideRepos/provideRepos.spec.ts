import { z } from 'zod'
import t from '..'
import provideRepos from '.'

const db = {} as any
const userRepositoryBuilder = vi.fn(() => {}) as any

const routes = t.router({
  testCall: t.procedure
    .use(provideRepos({ userRepository: userRepositoryBuilder }))
    .input(z.object({}))
    .query(() => 'ok'),
})

afterEach(() => {
  vi.resetAllMocks()
})

it('provides repos', async () => {
  const ctx = {
    db,
  }

  const caller = t.createCallerFactory(routes)
  const { testCall } = caller(ctx as any)

  expect(await testCall({})).toEqual('ok')
  expect(userRepositoryBuilder).toHaveBeenCalledWith(db)
})

it('skips providing repos if they are already in context', async () => {
  const ctx = {
    db,
    repositories: {
      userRepository: {},
    },
  }

  const caller = t.createCallerFactory(routes)

  const { testCall } = caller(ctx as any)

  expect(await testCall({})).toEqual('ok')
  expect(userRepositoryBuilder).not.toHaveBeenCalled()
})
