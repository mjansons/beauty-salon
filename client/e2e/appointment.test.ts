import { test, expect } from '@playwright/test'
import { fakeUser } from 'utils/fakeData'
import { asOwner, asSpecialist, loginNewSpecialist, asUser } from 'utils/api'

test.describe
  .serial('business can be set up and appointments can be made', () => {
  test('business can invite an employee', async ({ page }) => {
    const specialist = fakeUser()
    const owner = fakeUser()

    await loginNewSpecialist(specialist)

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await page
        .locator('form')
        .filter({ hasText: 'Add Employee' })
        .locator('#email')
        .fill(specialist.email)
      await page.getByRole('button', { name: 'Send invite' }).click()
    })

    await asSpecialist(page, specialist, async () => {
      await page.goto('/account')
      await page.getByRole('button', { name: 'Accept' }).click()
    })

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await expect(page.locator('text=Employees:')).toBeVisible()
      await expect(page.locator(`text=${specialist.email}`)).toBeVisible()
    })
  })

  test('unregistered user can make an appointment', async ({ page }) => {
    const customer = fakeUser()
    const specialist = fakeUser()
    const owner = fakeUser()

    await loginNewSpecialist(specialist)

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await page
        .locator('form')
        .filter({ hasText: 'Add Employee' })
        .locator('#email')
        .fill(specialist.email)
      await page.getByRole('button', { name: 'Send invite' }).click()
    })

    await asSpecialist(page, specialist, async () => {
      await page.goto('/account')
      await page.getByRole('button', { name: 'Accept' }).click()
    })

    const date = new Date()
    date.setDate(date.getDate() + 1)
    const formattedDate = date.toISOString().split('T')[0]

    await page.goto('/')
    await page.locator('select[name="service"]').selectOption('haircut')
    await page.locator('select[name="location"]').selectOption('riga')
    await page.locator('#date').fill(formattedDate)
    await page.getByRole('button', { name: 'Search' }).click()
    await page.waitForSelector('.specialist-container')

    const formattedFirstName =
      specialist.firstName.charAt(0).toUpperCase() +
      specialist.firstName.slice(1).toLowerCase()
    const formattedLastName =
      specialist.lastName.charAt(0).toUpperCase() +
      specialist.lastName.slice(1).toLowerCase()
    const specialistName = `${formattedFirstName} ${formattedLastName}`

    const container = page.locator(
      `.specialist-container:has(h2:has-text("${specialistName}"))`
    )
    await expect(container).toHaveCount(1)

    const appointmentButton = container
      .locator('.slots > button:enabled')
      .first()
    await expect(appointmentButton).toBeVisible()
    await appointmentButton.click()

    await page.getByLabel('Name', { exact: true }).fill(customer.firstName)
    await page.getByLabel('Surname', { exact: true }).fill(customer.lastName)
    await page.getByLabel('Email Address').fill(customer.email)
    await page.getByLabel('Phone number').fill(customer.phoneNumber)
    await page.getByLabel('Comment').fill('no comment')
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.getByRole('button', { name: 'Submit' }).click()
    await page.getByRole('button', { name: 'Return' }).click()

    await asOwner(page, owner, async () => {
      await page.goto('/appointments')
      await expect(page.getByText('haircut')).toBeVisible()
      await expect(page.getByText(customer.firstName)).toBeVisible()
      await expect(page.getByText(customer.lastName)).toBeVisible()
      await expect(page.getByText(customer.phoneNumber)).toBeVisible()
    })

    await asSpecialist(page, specialist, async () => {
      await page.goto('/appointments')
      await expect(page.getByText('haircut')).toBeVisible()
      await expect(page.getByText(customer.firstName)).toBeVisible()
      await expect(page.getByText(customer.lastName)).toBeVisible()
      await expect(page.getByText(customer.phoneNumber)).toBeVisible()
    })
  })

  test('registered user can make an appointment', async ({ page }) => {
    const customer = fakeUser()
    const specialist = fakeUser()
    const owner = fakeUser()

    await loginNewSpecialist(specialist)

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await page
        .locator('form')
        .filter({ hasText: 'Add Employee' })
        .locator('#email')
        .fill(specialist.email)
      await page.getByRole('button', { name: 'Send invite' }).click()
    })

    await asSpecialist(page, specialist, async () => {
      await page.goto('/account')
      await page.getByRole('button', { name: 'Accept' }).click()
    })

    await asUser(page, customer, async () => {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      const formattedDate = date.toISOString().split('T')[0]

      await page.goto('/')
      await page.locator('select[name="service"]').selectOption('haircut')
      await page.locator('select[name="location"]').selectOption('riga')
      await page.locator('#date').fill(formattedDate)

      await page.getByRole('button', { name: 'Search' }).click()
      await page.waitForSelector('.specialist-container')

      const formattedFirstName =
        specialist.firstName.charAt(0).toUpperCase() +
        specialist.firstName.slice(1).toLowerCase()
      const formattedLastName =
        specialist.lastName.charAt(0).toUpperCase() +
        specialist.lastName.slice(1).toLowerCase()
      const specialistName = `${formattedFirstName} ${formattedLastName}`

      const container = page.locator(
        `.specialist-container:has(h2:has-text("${specialistName}"))`
      )
      await expect(container).toHaveCount(1)

      const appointmentButton = container
        .locator('.slots > button:enabled')
        .first()
      await expect(appointmentButton).toBeVisible()
      await appointmentButton.click()

      await page.getByRole('button', { name: 'Continue' }).click()
      await page.getByLabel('Comment').fill('no comment')
      await page.getByRole('button', { name: 'Submit' }).click()
      await page.getByRole('button', { name: 'Return' }).click()
    })

    await asOwner(page, owner, async () => {
      await page.goto('/appointments')
      await expect(page.getByText('haircut')).toBeVisible()
      await expect(page.getByText(customer.firstName.toLocaleLowerCase())).toBeVisible()
      await expect(page.getByText(customer.lastName.toLocaleLowerCase())).toBeVisible()
      await expect(page.getByText(customer.phoneNumber)).toBeVisible()
    })

    await asSpecialist(page, specialist, async () => {
      await page.goto('/appointments')
      await expect(page.getByText('haircut')).toBeVisible()
      await expect(page.getByText(customer.firstName.toLocaleLowerCase())).toBeVisible()
      await expect(page.getByText(customer.lastName.toLocaleLowerCase())).toBeVisible()
      await expect(page.getByText(customer.phoneNumber)).toBeVisible()
    })
  })
})
