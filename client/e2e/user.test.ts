// user.test.ts

import { test, expect } from '@playwright/test'
import { fakeUser, fakeBusiness } from 'utils/fakeData'

test.describe.serial('signup and login sequence', () => {
  test('visitor can signup and log in as customer', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')

    // Fill out the signup form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    await page.waitForURL('/onboarding', { timeout: 10000 })

    await page
      .locator('div')
      .filter({ hasText: /^Book appointments$/ })
      .click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.waitForSelector('label:has-text("Name")', { timeout: 10000 })
    await page.locator('#name').fill(user.firstName)
    await page.locator('#surname').fill(user.lastName)

    await page.getByLabel('Phone number').fill(user.phoneNumber)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Navigate to login
    await page.getByRole('button', { name: 'Log in' }).click()

    // Fill out login form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Verify navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL('/dashboard')
  })

  test('visitor can signup and log in as business owner', async ({ page }) => {
    const user = fakeUser()
    const business = fakeBusiness()
    await page.goto('/signup')

    // Fill out the signup form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    // Select 'Manage a business or work'
    await page.getByText('Manage a business or work').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select 'Business' option
    await page.getByText('Business').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Fill out business details
    await page.getByLabel('Business name').fill(business.name)
    await page.getByLabel('Business email').fill(business.email)
    await page.getByLabel('Business phone number').fill(business.phoneNumber)
    await page.getByLabel('City').selectOption(business.city)
    await page.getByLabel('Address').fill(business.address)
    await page.getByLabel('Postal code').fill(business.postalCode)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set operational days
    const operationalDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]
    for (const day of operationalDays) {
      await page.locator(`#${day}-operational`).click()
      await page.locator(`#${day}-open`).fill('10:00')
      await page.locator(`#${day}-close`).fill('19:00')
    }

    // Continue after setting operational hours
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select specialities
    const specialities = ['haircut', 'nails', 'makeup']
    for (const speciality of specialities) {
      await page.getByText(speciality).click()
    }
    await page.getByRole('button', { name: 'Continue' }).click()

    // Fill out contact details
    await page.locator('#name').fill(user.firstName)
    await page.locator('#surname').fill(user.lastName)
    await page.getByLabel('Phone number').fill(user.phoneNumber)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Navigate to login
    await page.waitForTimeout(300)
    await page.getByRole('button', { name: 'Log in' }).click()

    // Fill out login form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard')
  })

  test('visitor can signup and log in as a specialist', async ({ page }) => {
    const user = fakeUser()
    await page.goto('/signup')

    // Fill out the signup form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password', { exact: true }).fill(user.password)
    await page.getByLabel('Repeat password').fill(user.password)
    await page.getByRole('button', { name: 'Create Account' }).click()

    // Select 'Manage a business or work'
    await page.getByText('Manage a business or work').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select 'Specialist' option
    await page.getByText('Specialist').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // Select specialities
    const specialities = ['haircut', 'nails', 'makeup']
    for (const speciality of specialities) {
      await page.getByText(speciality).click()
    }
    await page.getByRole('button', { name: 'Continue' }).click()

    // Set operational days
    const operationalDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]
    for (const day of operationalDays) {
      await page.locator(`#${day}-operational`).click()
      await page.locator(`#${day}-open`).fill('10:00')
      await page.locator(`#${day}-close`).fill('19:00')
    }

    // Continue after setting operational hours
    await page.getByRole('button', { name: 'Continue' }).click()

    // Fill out contact details
    await page.locator('#name').fill(user.firstName)
    await page.locator('#surname').fill(user.lastName)
    await page.getByLabel('Phone number').fill(user.phoneNumber)
    await page.getByRole('button', { name: 'Continue' }).click()

    // Navigate to login
    await page.getByRole('button', { name: 'Log in' }).click()

    // Fill out login form
    await page.getByLabel('Email Address').fill(user.email)
    await page.getByLabel('Password').fill(user.password)
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Verify navigation to dashboard
    await expect(page).toHaveURL('/dashboard')
  })
})
