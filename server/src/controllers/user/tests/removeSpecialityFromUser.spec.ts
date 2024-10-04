import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('removes a speciality', async () => {
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
  await insertAll(db, 'specialists', {
    registeredUserId: createdUser.id,
    specialityId: 1,
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

  expect(
    await validTokenCaller.removeSpecialityFromUser({ speciality: 'haircut' })
  ).toMatchObject({ message: 'success' })
})

it('should throw an error for unauthenticated change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(
    unauthenticatedCaller.removeSpecialityFromUser({ speciality: 'makeup' })
  ).rejects.toThrow(/unauthenticated/i)
})
