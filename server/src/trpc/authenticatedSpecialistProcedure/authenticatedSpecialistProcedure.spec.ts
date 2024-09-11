import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import authenticatedSpecialistProcedure from '.'

const db = await wrapInRollbacks(createTestDatabase())

const routes = t.router({
  testCall: authenticatedSpecialistProcedure.query(() => 'passed'),
})

const createCaller = t.createCallerFactory(routes)

it('allows specialist to pass', async () => {
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

  const response = await validTokenCaller.testCall()

  expect(response).toEqual('passed')
})

it('should throw an error for unauthenticated change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(unauthenticatedCaller.testCall()).rejects.toThrow(
    /unauthenticated/i
  )
})

it('throws an error if the user is does not have the role assigned', async () => {
  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: 1234,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true,
    },
  })

  await expect(validTokenCaller.testCall()).rejects.toThrow(/role/i)
})
