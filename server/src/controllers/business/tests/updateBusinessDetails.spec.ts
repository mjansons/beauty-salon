import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import businessRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

it('edits an existing business', async () => {
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
      email: 'newusere@gmail.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
      isOnboarded: true,
    },
  })

  const [addedBusiness] = await insertAll(db, 'businesses', {
    name: 'Business',
    city: 'vilnus',
    address: 'some streetd',
    postalCode: 'some code 1234',
    email: 'business@emai.com',
    phoneNumber: '12345678',
    ownerId: createdUser.id,
  })

  const newEntry = await validTokenCaller.updateBusinessDetails({
    businessId: addedBusiness.id,
    name: 'newBusinessName',
    city: 'vilnus',
    address: 'some streetd',
    postalCode: 'some code 1234',
    email: 'business@emai.com',
    phoneNumber: '12345678',
  })
  expect(newEntry).toMatchObject({ name: 'newbusinessname' })
})
