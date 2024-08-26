import { createTestDatabase } from '@tests/utils/database'
import t from '@server/trpc'
import userRouter from '..'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { selectAll } from '@tests/utils/records'

const db = await wrapInRollbacks(createTestDatabase())

const createCaller = t.createCallerFactory(userRouter)
const { signup } = createCaller({ db })

it('should save a user', async () => {
  const user = {
    email: 'email@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpassword',
    phoneNumber: '12345678',
  }

  await signup(user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email)
  )

  expect(createdUser).toBeDefined()
  expect(createdUser).toMatchObject({
    email: 'email@test.com',
    firstName: 'user',
    lastName: 'surname',
    phoneNumber: '12345678',
  })
})

it('should hash the password', async () => {
  const user = {
    email: 'email@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpassword',
    phoneNumber: '12345678',
  }

  await signup(user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email)
  )

  expect(createdUser.password.slice(0, 4)).toEqual('$2b$')
})

// it('throws error when it fails to assign role', async () => {
//   const user = {
//     email: 'email@test.com',
//     firstName: 'user',
//     lastName: 'surname',
//     password: 'verystrongpassword',
//     phoneNumber: '12345678',
//   }

//   await expect(signup(user)).rejects.toThrow(/role/i)
// })

it('throws an error for duplicate email', async () => {
  const user = {
    email: 'email@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpassword',
    phoneNumber: '12345678',
  }

  await signup(user)
  // expect that the second signup will throw an error
  await expect(signup(user)).rejects.toThrow(/email already exists/i)
})

it('should require a valid email', async () => {
  const user = {
    email: 'notvalidemail',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpassword',
    phoneNumber: '12345678',
  }

  await expect(signup(user)).rejects.toThrow(/email/i) // throws out some error complaining about "email"
})

it('should require a password with at least 8 characters', async () => {
  const user = {
    email: 'email@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'weak',
    phoneNumber: '12345678',
  }
  await expect(signup(user)).rejects.toThrow(/password/i) // throws out some error complaining about "password"
})

it('stores lowercased email', async () => {
  const user = {
    email: 'EMAIL@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: '12345678',
    phoneNumber: '12345678',
  }

  await signup(user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email.toLowerCase())
  )

  expect(createdUser.email).toEqual(user.email.toLowerCase())
})

it('stores email with trimmed whitespace', async () => {
  const user = {
    email: '  email@test.com   ',
    firstName: 'user',
    lastName: 'surname',
    password: '12345678',
    phoneNumber: '12345678',
  }

  await signup(user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email.trim())
  )

  expect(createdUser.email).toEqual(user.email.trim())
})
