import { apiOrigin, apiPath } from './config'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@server/shared/trpc'
import { fakeBusiness, workingHours, specialities } from './fakeData'
import type { Page } from '@playwright/test'
import superjson from 'superjson'

let accessToken: string | null = null

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${apiOrigin}${apiPath}`,

      // send the access token with every request
      headers: () => {
        return {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        }
      },
    }),
  ],
})

type UserLogin = Parameters<typeof trpc.user.signup.mutate>[0]
type UserLoginAuthed = UserLogin & { accessToken: string }

/**
 * Logs in a new user by signing them up and logging them in with the provided
 * user login information.
 */
export async function loginNewUser(
  userLogin: UserLogin
): Promise<UserLoginAuthed> {
  try {
    await trpc.user.signup.mutate(userLogin)
  } catch (error) {
    // ignore cases when user already exists
  }

  const loginResponse = await trpc.user.login.mutate(userLogin)

  return {
    ...userLogin,
    accessToken: loginResponse.accessToken,
  }
}

export async function loginNewSpecialist(
  userLogin: UserLogin
): Promise<UserLoginAuthed> {
  try {
    await trpc.user.signup.mutate(userLogin)

    const loginResponse = await trpc.user.login.mutate(userLogin)
    accessToken = loginResponse.accessToken

    await trpc.user.addRoleToUser.mutate({ role: 'specialist' })
    // Add specialities to the user
    const specialitiesList = specialities()
    for (const speciality of specialitiesList) {
      await trpc.user.addSpecialityToUser.mutate({ speciality })
    }

    const days = workingHours()
    // Add specialist working hours
    for (const day of days) {
      await trpc.user.addSpecialistHours.mutate(day)
    }
    // Update user details
    if (userLogin) {
      await trpc.user.updateUserDetails.mutate({
        email: userLogin.email,
        firstName: userLogin.firstName,
        lastName: userLogin.lastName,
        phoneNumber: userLogin.phoneNumber,
        isOnboarded: userLogin.isOnboarded,
      })
    }
    accessToken = null

    return {
      ...userLogin,
      accessToken: loginResponse.accessToken,
    }
  } catch (error) {
    // ignore cases when user already exists
  }

  const loginResponse = await trpc.user.login.mutate(userLogin)

  return {
    ...userLogin,
    accessToken: loginResponse.accessToken,
  }
}

export async function loginNewOwner(userLogin: UserLogin) {
  try {
    await trpc.user.signup.mutate(userLogin)
    const loginResponse = await trpc.user.login.mutate(userLogin)
    accessToken = loginResponse.accessToken

    const businessDetails = fakeBusiness()
    const businessCreated =
      await trpc.business.addBusiness.mutate(businessDetails)

    const services = specialities()
    // Add business specialities
    for (const speciality of services) {
      await trpc.business.addBusinessSpeciality.mutate({
        businessId: businessCreated.id,
        specialityName: speciality,
        price: 1,
      })
    }

    const days = workingHours()
    // Add business working hours

    for (const day of days) {
      await trpc.business.addBusinessHours.mutate({
        businessId: businessCreated.id,
        ...day,
      })
    }

    if (userLogin) {
      await trpc.user.updateUserDetails.mutate({
        email: userLogin.email,
        firstName: userLogin.firstName,
        lastName: userLogin.lastName,
        phoneNumber: userLogin.phoneNumber,
        isOnboarded: userLogin.isOnboarded,
      })
    }

    accessToken = null

    return {
      ...userLogin,
      accessToken: loginResponse.accessToken,
    }
  } catch (error) {
    // ignore cases when user already exists
  }

  const loginResponse = await trpc.user.login.mutate(userLogin)

  return {
    ...userLogin,
    accessToken: loginResponse.accessToken,
  }
}

export async function asOwner<T extends any>(
  page: Page,
  userLogin: UserLogin,
  callback: (user: UserLoginAuthed) => Promise<T>
): Promise<T> {
  // running independent tasks in parallel
  const [user] = await Promise.all([
    loginNewOwner(userLogin),
    (async () => {
      // if no page is open, go to the home page
      if (page.url() === 'about:blank') {
        await page.goto('/')
        await page.waitForURL('/')
      }
    })(),
  ])

  accessToken = user.accessToken
  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )

  const callbackResult = await callback(user)

  await page.evaluate(() => {
    localStorage.removeItem('token')
  })
  accessToken = null

  return callbackResult
}

export async function asSpecialist<T extends any>(
  page: Page,
  userLogin: UserLogin,
  callback: (user: UserLoginAuthed) => Promise<T>
): Promise<T> {
  // running independent tasks in parallel
  const [user] = await Promise.all([
    loginNewSpecialist(userLogin),
    (async () => {
      // if no page is open, go to the home page
      if (page.url() === 'about:blank') {
        await page.goto('/')
        await page.waitForURL('/')
      }
    })(),
  ])

  accessToken = user.accessToken
  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )

  const callbackResult = await callback(user)

  await page.evaluate(() => {
    localStorage.removeItem('token')
  })
  accessToken = null

  return callbackResult
}

export async function asUser<T extends any>(
  page: Page,
  userLogin: UserLogin,
  callback: (user: UserLoginAuthed) => Promise<T>
): Promise<T> {
  // running independent tasks in parallel
  const [user] = await Promise.all([
    loginNewUser(userLogin),
    (async () => {
      // if no page is open, go to the home page
      if (page.url() === 'about:blank') {
        await page.goto('/')
        await page.waitForURL('/')
      }
    })(),
  ])

  accessToken = user.accessToken
  await page.evaluate(
    ({ accessToken }) => {
      localStorage.setItem('token', accessToken)
    },
    { accessToken }
  )

  const callbackResult = await callback(user)

  await page.evaluate(() => {
    localStorage.removeItem('token')
  })
  accessToken = null

  return callbackResult
}


