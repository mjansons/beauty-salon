import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import businessRouter from '..'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

it('finds a business a business', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  const [createdUser] = await insertAll(db, 'registeredUsers', user)

  await insertAll(db, 'businesses', {
    email: 'business@emai.com',
    phoneNumber: '12345678',
    name: 'newBusiness',
    ownerId: createdUser.id,
    city: 'vilnus',
    address: 'some street',
    postalCode: 'some code 1234',
  })

  const publicCaller = createCaller({
    db,
  })

  const searchResult = await publicCaller.getBusinessesByTitle({
    searchTerm: 'newBusiness',
  })

  expect(searchResult).toEqual(expect.arrayContaining([expect.any(Object)]))
})
