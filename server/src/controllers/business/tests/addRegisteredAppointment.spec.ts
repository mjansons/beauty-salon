import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import businessRouter from '..'
import { insertAll, selectAll, clearTables } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import { getFutureTimestamp, addHoursToDate } from '@tests/utils/timestamps'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

beforeAll(async () => {
  // add client 2
  const user2 = {
    email: 'anotherone@test.com',
    firstName: 'user2',
    lastName: 'surname2',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678910',
  }
  const [createdUser2] = await insertAll(db, 'registeredUsers', user2)

  // basic specialities and roles are pre-populated in migrations
  // client = 1, specialist = 2, owner = 3
  // haircut = 1, nails = 2, makeup = 3

  // declere client 2 as a specialist and update his role
  await insertAll(db, 'specialists', {
    registeredUserId: createdUser2.id,
    specialityId: 1,
  })

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser2.id,
    roleId: 2,
  })

  // declere a business with client 2 as owner and update his role
  const [business] = await insertAll(db, 'businesses', {
    address: 'whatever street',
    city: 'big city',
    email: 'anotherone@test.com',
    name: 'the place',
    ownerId: createdUser2.id,
    phoneNumber: '12345678910',
    postalCode: 'GB-1',
  })

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser2.id,
    roleId: 3,
  })

  // link specialist to business
  await insertAll(db, 'businessEmployees', {
    businessId: business.id,
    employeeId: createdUser2.id,
  })

  // declare business specialities
  await insertAll(db, 'businessSpecialities', {
    businessId: business.id,
    price: 30,
    specialityId: 1,
  })

  // declare business working hours
  await insertAll(db, 'businessAvailability', {
    businessId: business.id,
    dayOfWeek: 0,
    startTime: '08:00:00.000Z',
    endTime: '21:00:00.000Z',
  })

  // decleare specialist schedule
  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser2.id,
    dayOfWeek: 0,
    startTime: '08:00:00.000Z',
    endTime: '21:00:00.000Z',
  })
})

it.todo('adds a new appointment', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)
  const futureTimestamp = getFutureTimestamp(1, 14)
  const futureTimestampPlus1h = addHoursToDate(futureTimestamp, 1)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  const [business] = await selectAll(db, 'businesses', (eb) =>
    eb('name', '=', 'the place')
  )

  const [speciality] = await selectAll(db, 'businessSpecialities', (eb) =>
    eb('businessId', '=', business.id)
  )

  const [specialist] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('firstName', '=', 'user2')
  )

  const newEntry = await validTokenCaller.addRegisteredUserAppointment({
    businessId: business.id,
    businessSpecialityId: speciality.id,
    specialistId: specialist.id,
    appointmentStartTime: futureTimestamp,
    appointmentEndTime: futureTimestampPlus1h,
  })

  expect(newEntry).toBeDefined()
  // expect(newEntry).toMatchObject({})
})

it('should throw an error for unauthenticated change', async () => {
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
    unauthenticatedCaller.addRegisteredUserAppointment({
      businessId: 76,
      businessSpecialityId: 8,
      specialistId: 7655,
      appointmentStartTime: new Date(),
      appointmentEndTime: new Date(),
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('throw error if the speciality is not of the business', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  const futureTimestamp = getFutureTimestamp(1, 14)
  const futureTimestampPlus1h = addHoursToDate(futureTimestamp, 1)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  const [business] = await selectAll(db, 'businesses', (eb) =>
    eb('name', '=', 'the place')
  )

  const [specialist] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('firstName', '=', 'user2')
  )

  await expect(
    validTokenCaller.addRegisteredUserAppointment({
      businessId: business.id,
      businessSpecialityId: 8,
      specialistId: specialist.id,
      appointmentStartTime: futureTimestamp,
      appointmentEndTime: futureTimestampPlus1h,
    })
  ).rejects.toThrow(/speciality/i)
})

it('throw error if the specialist is not of the business', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  const futureTimestamp = getFutureTimestamp(1, 14)
  const futureTimestampPlus1h = addHoursToDate(futureTimestamp, 1)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  const [business] = await selectAll(db, 'businesses', (eb) =>
    eb('name', '=', 'the place')
  )

  const [speciality] = await selectAll(db, 'businessSpecialities', (eb) =>
    eb('businessId', '=', business.id)
  )

  await expect(
    validTokenCaller.addRegisteredUserAppointment({
      businessId: business.id,
      businessSpecialityId: speciality.id,
      specialistId: 888,
      appointmentStartTime: futureTimestamp,
      appointmentEndTime: futureTimestampPlus1h,
    })
  ).rejects.toThrow(/employee/i)
})

it('throw error if the specialist is not specialised', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)
  const futureTimestamp = getFutureTimestamp(1, 14)
  const futureTimestampPlus1h = addHoursToDate(futureTimestamp, 1)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  const [business] = await selectAll(db, 'businesses', (eb) =>
    eb('name', '=', 'the place')
  )

  const [speciality] = await selectAll(db, 'businessSpecialities', (eb) =>
    eb('businessId', '=', business.id)
  )

  const [specialist] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('firstName', '=', 'user2')
  )

  // remove the specialisation
  await clearTables(db, ['specialists'])

  await expect(
    validTokenCaller.addRegisteredUserAppointment({
      businessId: business.id,
      businessSpecialityId: speciality.id,
      specialistId: specialist.id,
      appointmentStartTime: futureTimestamp,
      appointmentEndTime: futureTimestampPlus1h,
    })
  ).rejects.toThrow(/specialist/i)
})

it.todo('throw error if not within business working hours', async () => {
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

it.todo('throw error if not within specialists working hours', async () => {
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

it('throw error if booking for a past date', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)
  const startTime = new Date()
  const futureTimestampPlus1h = addHoursToDate(startTime, 1)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: createdUser.id,
      email: 'newusere@test.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  const [business] = await selectAll(db, 'businesses', (eb) =>
    eb('name', '=', 'the place')
  )

  const [speciality] = await selectAll(db, 'businessSpecialities', (eb) =>
    eb('businessId', '=', business.id)
  )

  const [specialist] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('firstName', '=', 'user2')
  )
  await expect(
    validTokenCaller.addRegisteredUserAppointment({
      businessId: business.id,
      businessSpecialityId: speciality.id,
      specialistId: specialist.id,
      appointmentStartTime: startTime,
      appointmentEndTime: futureTimestampPlus1h,
    })
  ).rejects.toThrow(/appointment/i)
})

it.todo('throw error if overlaps with specialists appointments', async () => {
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

it('prints stuff for me', async () => {
  const user2 = {
    email: 'anotherone@test.com',
    firstName: 'user2',
    lastName: 'surname2',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678910',
  }
  const [createdUser2] = await selectAll(db, 'registeredUsers', (eb) =>
    eb('email', '=', user2.email)
  )

  // console.log(createdUser2)

  // Example: Get a timestamp 1 day ahead of now
  const futureTimestamp = getFutureTimestamp(1, 14)
  // console.log(futureTimestamp)

  const futureTimestampPlus1h = addHoursToDate(futureTimestamp, 1)
  // console.log(futureTimestampPlus1h)
  // 2024-08-25T13:17:48.541Z

  const [hours] = await selectAll(db, 'businessAvailability')

  console.log(hours)
})
