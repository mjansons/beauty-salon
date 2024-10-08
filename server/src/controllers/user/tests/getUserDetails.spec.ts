import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('gets user details', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }

  const [createdUser] = await insertAll(db, 'registeredUsers', user)

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

  const updatedUser = await validTokenCaller.getUserDetails()

  expect(updatedUser).toMatchObject({
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    phoneNumber: '12345678',
  })
})

it('should throw an error for unauthorised change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(unauthenticatedCaller.getUserDetails()).rejects.toThrow(
    /unauthenticated/i
  )
})
