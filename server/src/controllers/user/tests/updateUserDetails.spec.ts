import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('changes the name to the new one, with authenticated user', async () => {
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

  const updatedUser = await validTokenCaller.updateUserDetails({
    firstName: 'Jesus',
  })

  expect(updatedUser).toMatchObject({ firstName: 'jesus' })
})

it('changes the name and surname to the new one, with authenticated user', async () => {
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

  const updatedUser = await validTokenCaller.updateUserDetails({
    firstName: 'Jesus',
    lastName: 'sonOfGod',
  })

  expect(updatedUser).toMatchObject({
    firstName: 'jesus',
    lastName: 'sonofgod',
  })
})

it('changes ignores wrong field update attempt', async () => {
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

  const updatedUser = await validTokenCaller.updateUserDetails({
    id: 9999,
    firstName: 'Jesus',
    lastName: 'sonOfGod',
  } as { id: number; firstName: string; lastName: string })

  expect(updatedUser).toMatchObject({
    id: createdUser.id,
    firstName: 'jesus',
    lastName: 'sonofgod',
  })
})

it('should throw an error for unauthorised change', async () => {
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
    unauthenticatedCaller.updateUserDetails({ password: 'arstarst' })
  ).rejects.toThrow(/unauthenticated/i)
})
