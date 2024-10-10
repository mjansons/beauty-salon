import { test, expect } from '@playwright/test'
import { fakeUser, fakeBusiness } from 'utils/fakeData'

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup and log in as customer', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')

    await page.getByLabel('Email Address').click()
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).click()

    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').click()
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()
    await page.waitForURL('/onboarding')
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByLabel('Name').click()
    await page.getByLabel('Name').fill('name')
    await page.locator('#suraname').click()
    await page.locator('#suraname').fill('slrnhearst')
    await page.getByLabel('Phone number').click()
    await page.getByLabel('Phone number').fill('12341234')
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByLabel('Email Address').click()
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('visitor can signup and log in as business owner', async ({ page }) => {
    const user = fakeUser()
    const business = fakeBusiness()
    await page.goto('/signup')

    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    await page.getByText('Work or manage my business').click()
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByText('Business').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByLabel('Business name').fill(business.name)
    await page.getByLabel('Business email').fill(business.email)
    await page.getByLabel('Business phone number').fill(business.phoneNumber)
    await page.getByLabel('City').selectOption(business.city)
    await page.getByLabel('Address').fill(business.address)
    await page.getByLabel('Postal code').fill(business.postalCode)
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.locator('#Monday-operational').check()
    await page.locator('#Tuesday-operational').check()
    await page.locator('#Wednesday-operational').check()
    await page.locator('#Thursday-operational').check()
    await page.locator('#Friday-operational').check()
    await page.locator('#Saturday-operational').check()
    await page.locator('#Sunday-operational').check()

    await page.locator('#Monday-open').fill('10:00')
    await page.locator('#Monday-close').fill('19:00')

    await page.locator('#Tuesday-open').fill('10:00')
    await page.locator('#Tuesday-close').fill('19:00')

    await page.locator('#Wednesday-open').fill('10:00')
    await page.locator('#Wednesday-close').fill('19:00')

    await page.locator('#Thursday-open').fill('10:00')
    await page.locator('#Thursday-close').fill('19:00')

    await page.locator('#Friday-open').fill('10:00')
    await page.locator('#Friday-close').fill('19:00')

    await page.locator('#Saturday-open').fill('10:00')
    await page.locator('#Saturday-close').fill('19:00')

    await page.locator('#Sunday-open').fill('10:00')
    await page.locator('#Sunday-close').fill('19:00')

    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByText('haircut').click()
    await page.getByText('nails').click()
    await page.getByText('makeup').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByLabel('Name').fill(user.firstName)
    await page.locator('#suraname').fill(user.lastName)
    await page.getByLabel('Phone number').fill(user.phoneNumber)
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })

  test('visitor can signup and log in as a specialist', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')

    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    await page.getByText('Work or manage my business').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByText('Specialist').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByText('haircut').click()
    await page.getByText('nails').click()
    await page.getByText('makeup').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.locator('#Monday-operational').check()
    await page.locator('#Tuesday-operational').check()
    await page.locator('#Wednesday-operational').check()
    await page.locator('#Thursday-operational').check()
    await page.locator('#Friday-operational').check()
    await page.locator('#Saturday-operational').check()
    await page.locator('#Sunday-operational').check()

    await page.locator('#Monday-open').fill('10:00')
    await page.locator('#Monday-close').fill('19:00')

    await page.locator('#Tuesday-open').fill('10:00')
    await page.locator('#Tuesday-close').fill('19:00')

    await page.locator('#Wednesday-open').fill('10:00')
    await page.locator('#Wednesday-close').fill('19:00')

    await page.locator('#Thursday-open').fill('10:00')
    await page.locator('#Thursday-close').fill('19:00')

    await page.locator('#Friday-open').fill('10:00')
    await page.locator('#Friday-close').fill('19:00')

    await page.locator('#Saturday-open').fill('10:00')
    await page.locator('#Saturday-close').fill('19:00')

    await page.locator('#Sunday-open').fill('10:00')
    await page.locator('#Sunday-close').fill('19:00')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByLabel('Name').fill(user.firstName)
    await page.locator('#suraname').fill(user.lastName)
    await page.getByLabel('Phone number').fill(user.phoneNumber)
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('button', { name: 'Log in' }).click()
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})
