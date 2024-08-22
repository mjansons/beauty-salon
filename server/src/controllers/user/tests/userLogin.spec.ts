import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { clearTables } from '@tests/utils/records'

const db = createTestDatabase()
const createCaller = t.createCallerFactory(userRouter)
const { login, signup } = createCaller({ db })

const user = {
  email: 'someoneelse@test.com',
  firstName: 'user',
  lastName: 'surname',
  password: 'verystrongpasswordthatishashed',
  phoneNumber: '12345678',
}

afterEach(async () => {
  await clearTables(db, ['registeredUsers'])
  vi.clearAllMocks()
})

it('returns a token if the password matches', async () => {
  // await create_registered_user(user)
  await signup(user)
  const { accessToken } = await login({
    email: user.email,
    password: user.password,
  })
  console.log(accessToken)

  expect(accessToken).toEqual(expect.any(String))
  expect(accessToken.slice(0, 3)).toEqual('eyJ')
})

it('should throw an error for non-existant user', async () => {
  await signup(user)
  await expect(
    login({
      email: 'nonexisting@user.com',
      password: 'somepassword',
    })
  ).rejects.toThrow()
})

it('should throw an error for incorrect password', async () => {
  await signup(user)
  expect(
    login({
      email: user.email,
      password: 'password.123!',
    })
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await signup(user)
  await expect(
    login({
      email: 'not-an-email',
      password: user.password,
    })
  ).rejects.toThrow(/email/)
})

it('throws an error for a short password', async () => {
  await signup(user)
  await expect(
    login({
      email: user.email,
      password: 'short',
    })
  ).rejects.toThrow(/password/)
})

it('allows logging in with different email case', async () => {
  await signup(user)
  await expect(
    login({
      email: user.email.toUpperCase(),
      password: user.password,
    })
  ).resolves.toEqual(expect.anything())
})

it('allows logging in with surrounding white space', async () => {
  await signup(user)
  await expect(
    login({
      email: ` \t ${user.email}\t `, // tabs and spaces
      password: user.password,
    })
  ).resolves.toEqual(expect.anything())
})