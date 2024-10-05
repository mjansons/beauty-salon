import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('gets user roles', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 1,
  })

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true,
    },
  })

  const updatedUser = await validTokenCaller.getUserRoles()

  expect(updatedUser).toMatchObject(['client'])
})

it('gets both user roles', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 1,
  })

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 2,
  })

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true,
    },
  })

  const updatedUser = await validTokenCaller.getUserRoles()

  expect(updatedUser).toMatchObject(['client', 'specialist'])
})

it('should throw an error for unauthorised change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(unauthenticatedCaller.getUserRoles()).rejects.toThrow(
    /unauthenticated/i
  )
})
