import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import businessRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

it('creates a business', async () => {
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
    },
  })

  const newEntry = await validTokenCaller.addBusiness({
    name: 'newBusiness',
    city: 'vilnus',
    address: 'some streetd',
    postalCode: 'some code 1234',
    email: 'business@emai.com',
    phoneNumber: '12345678',
  })

  expect(newEntry).toBeDefined()
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
    unauthenticatedCaller.addBusiness({
      name: 'newBusiness',
      city: 'vilnus',
      address: 'some streetd',
      postalCode: 'some code 1234',
      email: 'business@emai.com',
      phoneNumber: '12345678',
    })
  ).rejects.toThrow(/unauthenticated/i)
})

it('throws error if user cannot be located', async () => {
  const user = {
    email: 'newusere@test.com',
    firstName: 'user',
    lastName: 'surname',
    password: 'verystrongpasswordthatishashed',
    phoneNumber: '12345678',
  }
  await insertAll(db, 'registeredUsers', user)

  const validTokenCaller = createCaller({
    db,
    authUser: {
      id: 1234,
      email: 'newusere@gmail.com',
      firstName: 'user',
      lastName: 'surname',
      phoneNumber: '12345678',
    },
  })

  await expect(
    validTokenCaller.addBusiness({
      name: 'newBusiness',
      city: 'vilnus',
      address: 'some streetd',
      postalCode: 'some code 1234',
      email: 'business@emai.com',
      phoneNumber: '12345678',
    })
  ).rejects.toThrow(/user/i)
})

it('throws error if role cant be updated', async () => {
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
    },
  })

  const newEntry = await validTokenCaller.addBusiness({
    name: 'newBusiness',
    city: 'vilnus',
    address: 'some streetd',
    postalCode: 'some code 1234',
    email: 'business@emai.com',
    phoneNumber: '12345678',
  })

  expect(newEntry).toBeDefined()
})