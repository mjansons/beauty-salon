import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import invitationRouter from '..'
import { insertAll } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'
import { requestContext } from '@tests/utils/context'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(invitationRouter)

it('gets invitation', async () => {
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

  await insertAll(db, 'specialists', {
    registeredUserId: createdUser.id,
    specialityId: 3,
  })
  await insertAll(db, 'userRoles', {
    registeredUserId: createdUser.id,
    roleId: 2,
  })

  await insertAll(db, 'invitations', {
    businessId: createdBusiness.id,
    employeeId: createdUser.id,
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

  const invite = await validTokenCaller.getUserInvitations()

  expect(invite).toMatchObject([{ businessId: createdBusiness.id }])
})

it('should throw an error for unauthenticated change', async () => {
  const unauthenticatedCaller = createCaller(
    requestContext({
      db,
    })
  )

  await expect(unauthenticatedCaller.getUserInvitations()).rejects.toThrow(
    /unauthenticated/i
  )
})
