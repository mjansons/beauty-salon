import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import appointmentRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(appointmentRouter)

it('gets 1/2 businesses, because of employee work time', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  const [createdBusiness] = await insertAll(db, 'businesses', {
    name: 'Whatever name',
    ownerId: createdUser.id,
    city: 'riga',
    address: 'some street',
    postalCode: 'ev123',
    email: 'mail@mail.com',
    phoneNumber: '12345678',
  })

  await insertAll(db, 'businessAvailability', {
    businessId: createdBusiness.id,
    dayOfWeek: 1,
    endTime: '20:00:00',
    startTime: '08:00:00',
  })

  await insertAll(db, 'businessEmployees', {
    businessId: createdBusiness.id,
    employeeId: createdUser.id,
  })

  const [businessSpeciality] = await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness.id,
    price: 30,
    specialityId: 1,
  })

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser.id,
    specialityId: 1,
  })

  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser.id,
    dayOfWeek: 1,
    startTime: '08:00:00',
    endTime: '20:00:00',
  })

  await insertAll(db, 'userAppointments', {
    appointmentStartTime: '2022-11-28T17:00:00Z',
    appointmentEndTime: '2022-11-28T18:00:00Z',
    businessId: createdBusiness.id,
    businessSpecialityId: businessSpeciality.id,
    clientId: null,
    comment: 'Appointment comment',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    specialistId: createdUser.id,
  })

  const user2 = {
    email: 'newuser2@test.com',
    firstName: 'user2',
    lastName: 'surname2',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '123456782',
  }

  const [createdUser2] = await insertAll(db, 'registeredUsers', user2)

  const [createdBusiness2] = await insertAll(db, 'businesses', {
    name: 'Whatever name2',
    ownerId: createdUser2.id,
    city: 'riga',
    address: 'some street',
    postalCode: 'ev123',
    email: 'mailo@mail.com',
    phoneNumber: '12345678',
  })

  await insertAll(db, 'businessAvailability', {
    businessId: createdBusiness2.id,
    dayOfWeek: 1,
    endTime: '20:00:00',
    startTime: '08:00:00',
  })

  await insertAll(db, 'businessEmployees', {
    businessId: createdBusiness2.id,
    employeeId: createdUser2.id,
  })

  const [businessSpeciality2] = await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness2.id,
    price: 30,
    specialityId: 1,
  })

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser2.id,
    specialityId: 1,
  })

  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser2.id,
    dayOfWeek: 2,
    startTime: '08:00:00',
    endTime: '20:00:00',
  })

  await insertAll(db, 'userAppointments', {
    appointmentStartTime: '2022-11-28T17:00:00Z',
    appointmentEndTime: '2022-11-28T19:00:00Z',
    businessId: createdBusiness2.id,
    businessSpecialityId: businessSpeciality2.id,
    clientId: null,
    comment: 'Appointment comment2',
    email: 'user@example.com',
    firstName: 'PeterClient',
    lastName: 'Another',
    phoneNumber: '1234567890',
    specialistId: createdUser2.id,
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

  const avaliableSpecialists = await validTokenCaller.getSlotInfo({
    location: 'riga',
    service: 'haircut',
    date: '2022-11-28',
    page: 1,
  })

  expect(avaliableSpecialists).toMatchObject([
    {
      postalCode: 'ev123',
      price: 30,
      specialistFirstName: 'user',
      specialistId: createdUser.id,
      specialistLastName: 'surname',
      specialityId: 1,
    },
  ])
})

it('gets 2/2 businesses, because of employee work time', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  const [createdBusiness] = await insertAll(db, 'businesses', {
    name: 'Whatever name',
    ownerId: createdUser.id,
    city: 'riga',
    address: 'some street',
    postalCode: 'ev123',
    email: 'mail@mail.com',
    phoneNumber: '12345678',
  })

  await insertAll(db, 'businessAvailability', {
    businessId: createdBusiness.id,
    dayOfWeek: 1,
    endTime: '20:00:00',
    startTime: '08:00:00',
  })

  await insertAll(db, 'businessEmployees', {
    businessId: createdBusiness.id,
    employeeId: createdUser.id,
  })

  const [businessSpeciality] = await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness.id,
    price: 30,
    specialityId: 1,
  })

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser.id,
    specialityId: 1,
  })

  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser.id,
    dayOfWeek: 1,
    startTime: '08:00:00',
    endTime: '20:00:00',
  })

  await insertAll(db, 'userAppointments', {
    appointmentStartTime: '2022-11-28T17:00:00Z',
    appointmentEndTime: '2022-11-28T18:00:00Z',
    businessId: createdBusiness.id,
    businessSpecialityId: businessSpeciality.id,
    clientId: null,
    comment: 'Appointment comment',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
    specialistId: createdUser.id,
  })

  const user2 = {
    email: 'newuser2@test.com',
    firstName: 'user2',
    lastName: 'surname2',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '123456782',
  }

  const [createdUser2] = await insertAll(db, 'registeredUsers', user2)

  const [createdBusiness2] = await insertAll(db, 'businesses', {
    name: 'Whatever name2',
    ownerId: createdUser2.id,
    city: 'riga',
    address: 'some street',
    postalCode: 'ev123',
    email: 'mailo@mail.com',
    phoneNumber: '12345678',
  })

  await insertAll(db, 'businessAvailability', {
    businessId: createdBusiness2.id,
    dayOfWeek: 1,
    endTime: '20:00:00',
    startTime: '08:00:00',
  })

  await insertAll(db, 'businessEmployees', {
    businessId: createdBusiness2.id,
    employeeId: createdUser2.id,
  })

  const [businessSpeciality2] = await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness2.id,
    price: 30,
    specialityId: 1,
  })

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser2.id,
    specialityId: 1,
  })

  await insertAll(db, 'specialistAvailability', {
    specialistId: createdUser2.id,
    dayOfWeek: 1,
    startTime: '08:00:00',
    endTime: '20:00:00',
  })

  await insertAll(db, 'userAppointments', {
    appointmentStartTime: '2022-11-28T17:00:00Z',
    appointmentEndTime: '2022-11-28T19:00:00Z',
    businessId: createdBusiness2.id,
    businessSpecialityId: businessSpeciality2.id,
    clientId: null,
    comment: 'Appointment comment2',
    email: 'user@example.com',
    firstName: 'PeterClient',
    lastName: 'Another',
    phoneNumber: '1234567890',
    specialistId: createdUser2.id,
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

  const avaliableSpecialists = await validTokenCaller.getSlotInfo({
    location: 'riga',
    service: 'haircut',
    date: '2022-11-28',
    page: 1,
  })

  expect(avaliableSpecialists).toMatchObject([
    {
      postalCode: 'ev123',
      price: 30,
      specialistFirstName: 'user',
      specialistId: createdUser.id,
      specialistLastName: 'surname',
      specialityId: 1,
    },
    {
      postalCode: 'ev123',
      price: 30,
      specialistFirstName: 'user2',
      specialistId: createdUser2.id,
      specialistLastName: 'surname2',
      specialityId: 1,
    },
  ])
})
