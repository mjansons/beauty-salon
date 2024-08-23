import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { insertAll, selectAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it.todo('adds a speciality', async () => {
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

  await validTokenCaller.addRoleToUser({ role: 'client' })

  const [newEntry] = await selectAll(db, 'userRoles', (eb) =>
    eb('registeredUserId', '=', createdUser.id)
  )

  expect(newEntry).toBeDefined()
})

it.todo('should throw an error for unauthenticated change', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  await insertAll(db, 'registeredUsers', user)

  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(
    unauthenticatedCaller.addRoleToUser({ role: 'client' })
  ).rejects.toThrow(/unauthenticated/i)
})

it.todo('should throw an error for invalid speciality type', async () => {
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
    validTokenCaller.addRoleToUser({ role: 'invalidRole' })
  ).rejects.toThrow(/invalid/i)
})

it.todo('should throw an error if speciality already added', async () => {
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

  await validTokenCaller.addRoleToUser({ role: 'client' })

  await expect(
    validTokenCaller.addRoleToUser({ role: 'client' })
  ).rejects.toThrow(/duplicate/i)
})
