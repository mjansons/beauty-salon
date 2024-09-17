import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(userRouter)

it('adds specialist hours for a specific day', async () => {
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

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true
    },
  })

  const workdayDay = await validTokenCaller.addSpecialistHours({
    dayOfWeek: 0,
    startTime: '08:00:00',
    endTime: '21:00:00',
  })

  expect(workdayDay).toBeDefined()
})

it('should throw an error for unauthenticated change', async () => {
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

  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(
    unauthenticatedCaller.addSpecialistHours({
      dayOfWeek: 0,
      startTime: '08:00:00',
      endTime: '21:00:00',
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('throw error if hours start before closing', async () => {
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
  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true
    },
  })

  await expect(
    validTokenCaller.addSpecialistHours({
      dayOfWeek: 0,
      startTime: '09:00:00',
      endTime: '08:00:00',
    })
  ).rejects.toThrow(/time/i)
})

it('throw error if specialist role not assigned to user', async () => {
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

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true
    },
  })

  await expect(
    validTokenCaller.addSpecialistHours({
      dayOfWeek: 0,
      startTime: '08:00:00',
      endTime: '09:00:00',
    })
  ).rejects.toThrow(/role/i)
})

it('throw error if specialist has not specialised in anything yet', async () => {
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
      isOnboarded: true
    },
  })

  await expect(
    validTokenCaller.addSpecialistHours({
      dayOfWeek: 0,
      startTime: '08:00:00',
      endTime: '09:00:00',
    })
  ).rejects.toThrow(/specialised/i)
})

it('returns if day has already assigned time', async () => {
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
  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true
    },
  })

  await validTokenCaller.addSpecialistHours({
    dayOfWeek: 0,
    startTime: '09:00:00',
    endTime: '10:00:00',
  })

  expect(
    await validTokenCaller.addSpecialistHours({
      dayOfWeek: 0,
      startTime: '09:00:00',
      endTime: '10:00:00',
    })
  ).toMatchObject({
    message: expect.stringMatching(/duplicate/i),
  })
})
