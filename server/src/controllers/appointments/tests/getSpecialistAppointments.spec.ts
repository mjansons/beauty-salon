import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import appointmentRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(appointmentRouter)

it('gets appointments', async () => {
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

  const [businessSpeciality] = await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness.id,
    price: 30,
    specialityId: 1,
  })

  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 2,
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

  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
  const twoHoursFromNow = new Date(Date.now() + 120 * 60 * 1000)

  await insertAll(db, 'userAppointments', {
    appointmentStartTime: oneHourFromNow,
    appointmentEndTime: twoHoursFromNow,
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

  const avaliableSpecialists =
    await validTokenCaller.getSpecialistAppointments()

  expect(avaliableSpecialists).toMatchObject([
    {
      comment: 'Appointment comment',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      speciality: 'haircut',
    },
  ])
})
