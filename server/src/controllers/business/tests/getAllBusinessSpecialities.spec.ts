import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'
import businessRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

it('deletes a business speciality', async () => {
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
    city: 'somewhere',
    address: 'some street',
    postalCode: 'ev123',
    email: 'mail@mail.com',
    phoneNumber: '12345678',
  })

  await insertAll(db, 'businessSpecialities', {
    businessId: createdBusiness.id,
    price: 30,
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

  const specialities = await validTokenCaller.getAllBusinessSpecialities({
    businessId: createdBusiness.id,
  })

  expect(specialities).toMatchObject([{ speciality: 'haircut',  price: 30 }])
})

it('should throw an error for unauthenticated change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(
    unauthenticatedCaller.getAllBusinessSpecialities({
      businessId: 1234,
    })
  ).rejects.toThrow(/unauthenticated/i)
})