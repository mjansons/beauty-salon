import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import { insertAll, selectAll } from '@tests/utils/records'
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

  const [business] = await insertAll(db, 'businesses', {
    email: 'business@emai.com',
    phoneNumber: '12345678',
    name: 'newBusiness',
    ownerId: createdUser.id,
    city: 'vilnus',
    address: 'some street',
    postalCode: 'some code 1234',
  })

  await insertAll(db, 'businessSpecialities', {
    businessId: business.id,
    price: 30,
    specialityId: 3,
  })

  await selectAll(db, 'businessSpecialities')
  await selectAll(db, 'specialities')

  const publicCaller = createCaller({
    db,
  })
  // specialities are already in db:
  // { id: 1, speciality: 'haircut' },
  // { id: 2, speciality: 'nails' },
  // { id: 3, speciality: 'makeup' }
  const searchResult = await publicCaller.getBusinessesByService({
    searchTerm: 'makeup',
  })

  expect(searchResult).toEqual(expect.arrayContaining([expect.any(Object)]))
})
