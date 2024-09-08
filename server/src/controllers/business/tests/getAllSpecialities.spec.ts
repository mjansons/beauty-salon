import t from '@server/trpc'
import { createTestDatabase } from '@tests/utils/database'
import businessRouter from '..'
import { insertAll, clearTables } from '@tests/utils/records'
import { wrapInRollbacks } from '@tests/utils/transactions'

const db = await wrapInRollbacks(createTestDatabase())
const createCaller = t.createCallerFactory(businessRouter)

it('finds specialities', async () => {
  await clearTables(db, ['specialities'])

  await insertAll(db, 'specialities', { speciality: 'haircut' })

  const publicCaller = createCaller({
    db,
  })
  const searchResult = await publicCaller.getAllSpecialities()

  expect(searchResult).toEqual([
    { id: expect.any(Number), speciality: 'haircut' },
  ])
})

it('returns an empty list when there are on specialities', async () => {
  await clearTables(db, ['specialities'])

  const publicCaller = createCaller({
    db,
  })

  const searchResult = await publicCaller.getAllSpecialities()

  expect(searchResult).toEqual([])
})
