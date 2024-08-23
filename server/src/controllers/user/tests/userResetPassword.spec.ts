import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { clearTables, insertAll, selectAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)
const { login, signup } = createCaller({ db })

it('changes the password to the new one, with authenticated user', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  await insertAll(db, 'registeredUsers', user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email)
  )

  const validTokenCaller = createCaller({
    db,
    authUser: { id: createdUser.id },
  })

  await validTokenCaller.resetPassword({
    password: 'abracadabra',
  })

  const [createdUserNewPass] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('id', '=', createdUser.id)
  )

  expect(createdUserNewPass.password.slice(0, 4)).toEqual('$2b$')
})

it('should throw an error for too short password', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  await insertAll(db, 'registeredUsers', user)

  const [createdUser] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user.email)
  )

  const validTokenCaller = createCaller({
    db,
    authUser: { id: createdUser.id },
  })

  await expect(
    validTokenCaller.resetPassword({ password: 'arst' })
  ).rejects.toThrow(/password/)
})
