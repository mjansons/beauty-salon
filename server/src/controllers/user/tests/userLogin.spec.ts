import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { insertAll } from '@tests/utils/records'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)
const { login } = createCaller({ db })

const theuser = {
  email: 'someoneelse@test.com',
  firstName: 'user',
  lastName: 'surname',
  password: 'verystrongpasswordthatishashed',
  phoneNumber: '12345678',
}

vi.mock('bcrypt', () => ({
  default: {
    compare: (currentPass: string, storedPass: string) => {
      if (currentPass === 'verystrongpasswordthatishashed') {
        return true
      }
      false
    },
  },
}))

afterAll(async () => {
  vi.clearAllMocks()
})

it('returns a token if the password matches', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  const { accessToken } = await login({
    email: theuser.email,
    password: theuser.password,
  })

  expect(accessToken).toEqual(expect.any(String))
  expect(accessToken.slice(0, 3)).toEqual('eyJ')
})

it('should throw an error for non-existant user', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  await expect(
    login({
      email: 'nonexisting@user.com',
      password: 'somepassword',
    })
  ).rejects.toThrow()
})

it('should throw an error for incorrect password', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  expect(
    login({
      email: theuser.email,
      password: 'password.123!',
    })
  ).rejects.toThrow(/password/i)
})

it('throws an error for invalid email', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  // await signup(theuser)
  await expect(
    login({
      email: 'not-an-email',
      password: theuser.password,
    })
  ).rejects.toThrow(/email/i)
})

it('throws an error for a short password', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  await expect(
    login({
      email: theuser.email,
      password: 'short',
    })
  ).rejects.toThrow(/password/)
})

it('allows logging in with different email case', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  await expect(
    login({
      email: theuser.email.toUpperCase(),
      password: theuser.password,
    })
  ).resolves.toEqual(expect.anything())
})

it('allows logging in with surrounding white space', async () => {
  await insertAll(db, 'registeredUsers', theuser)
  await expect(
    login({
      email: ` \t ${theuser.email}\t `, // tabs and spaces
      password: theuser.password,
    })
  ).resolves.toEqual(expect.anything())
})
