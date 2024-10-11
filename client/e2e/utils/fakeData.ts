import { Chance } from 'chance'

// Chance is a lightweight fake data generator.
// Faker.js is another popular library, but it is relatively slow to import.
// Also, if we are running tests in CI server, we want to use the same seed
// every time to make the tests deterministic.
export const random = process.env.CI ? Chance(1) : Chance()

/**
 * Creates a new user with a random email and password. We want a random email
 * as our E2E tests can run against a real database, and we don't want to
 * our tests to fail because of a duplicate email.
 */
export const fakeUser = () => ({
  email: random.email(),
  firstName: random.first().split(' ')[0],
  lastName: random.last(),
  password: 'password.123',
  phoneNumber: `${random.string({ length: 8, pool: '0123456789' })}`,
  isOnboarded: true,
})

export const fakeBusiness = () => ({
  name: random.company(),
  email: random.email(),
  phoneNumber: `${random.string({ length: 8, pool: '0123456789' })}`,
  city: "riga",
  address: random.address(),
  postalCode: random.zip(),
})

export const workingHours = () => ([
  { dayOfWeek: 1, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 2, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 3, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 4, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 5, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 6, startTime: '08:00:00', endTime: '17:00:00' },
  { dayOfWeek: 0, startTime: '08:00:00', endTime: '17:00:00' },
])

export const specialities = () => ['haircut', 'nails', 'makeup'];
