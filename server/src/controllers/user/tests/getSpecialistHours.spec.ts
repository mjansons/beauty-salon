import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import userRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('gets all specialist hours', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser.id,
    specialityId: 3,
  })
  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 2,
  })

  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser.id,
    dayOfWeek: 0,
    startTime: '08:00:00',
    endTime: '21:00:00',
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

  expect(await validTokenCaller.getSpecialistHours()).toMatchObject([{
    specialistId: createdUser.id,
    dayOfWeek: 0,
    startTime: '08:00:00',
    endTime: '21:00:00',
  }])
})

it('should throw an error for unauthenticated change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(unauthenticatedCaller.getSpecialistHours()).rejects.toThrow(
    /unauthenticated/i
  )
})
