import { test, expect } from '@playwright/test'
import { fakeUser, fakeBusiness } from 'utils/fakeData'
import { asOwner, asSpecialist, asUser } from 'utils/api'

test.describe.serial('account details can be edited', () => {
  test('business owner can edit account details', async ({ page }) => {
    const owner = fakeUser()
    const businessDetails = fakeBusiness()

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await page
        .locator('form')
        .filter({ hasText: 'Business name' })
        .locator('#email')
        .fill(businessDetails.email)
      await page.getByLabel('City').selectOption('liepaja')
      await page.getByLabel('Address').fill(businessDetails.address)
      await page.getByLabel('Postal code').fill(businessDetails.postalCode)
      await page
        .locator('form')
        .filter({ hasText: 'Business name' })
        .locator('select[name="prefix"]')
        .selectOption('+371')
      await page
        .locator('form')
        .filter({ hasText: 'Business name' })
        .locator('#phone-number')
        .fill(businessDetails.phoneNumber)
      await page
        .locator('form')
        .filter({ hasText: 'Business name' })
        .getByRole('button')
        .click()

      await page.waitForSelector('text=Changes saved successfully!')

      await page.locator('#Monday-open').fill('08:00')
      await page.locator('#Monday-close').fill('22:00')
      await page.locator('#Tuesday-operational').uncheck()
      await page
        .locator('form')
        .filter({ hasText: 'Monday-Tuesday-Wednesday-' })
        .getByRole('button')
        .click()

      await page.waitForSelector('text=Changes saved successfully!')

      await page
        .locator('div')
        .filter({ hasText: /^haircut/ })
        .getByPlaceholder('Price')
        .fill('30')
      await page
        .locator('div')
        .filter({ hasText: /^nails/ })
        .getByPlaceholder('Price')
        .fill('30')

      await page
        .locator('form')
        .filter({ hasText: 'Business Specialities' })
        .getByRole('button', { name: 'Save changes' })
        .click()

      await page.waitForSelector('text=Changes saved successfully!')
      await page.reload()

      await expect(
        page
          .locator('form')
          .filter({ hasText: 'Business nameBusiness' })
          .locator('#email')
      ).toHaveValue(businessDetails.email.toLowerCase())
      await expect(page.getByLabel('City')).toHaveValue('liepaja')
      await expect(page.getByLabel('Address')).toHaveValue(
        businessDetails.address.toLowerCase()
      )
      await expect(page.getByLabel('Postal code')).toHaveValue(
        businessDetails.postalCode.toLowerCase()
      )
      await expect(page.locator('#Monday-open')).toHaveValue('08:00')
      await expect(page.locator('#Monday-close')).toHaveValue('22:00')
      await expect(page.locator('#Tuesday-operational')).not.toBeChecked()

      await expect(
        page
          .locator('div')
          .filter({ hasText: /^haircut/ })
          .getByPlaceholder('Price')
      ).toHaveValue('30')

      await expect(
        page
          .locator('div')
          .filter({ hasText: /^nails/ })
          .getByPlaceholder('Price')
      ).toHaveValue('30')
    })
  })

  test('specialists can edit account details', async ({ page }) => {
    const specialist = fakeUser()

    await asSpecialist(page, specialist, async () => {
      await page.goto('/account')

      await page.locator('#Monday-open').fill('08:00')
      await page.locator('#Monday-close').fill('22:00')
      await page.locator('#Tuesday-operational').uncheck()
      await page
        .locator('form')
        .filter({ hasText: 'Monday-Tuesday-Wednesday-' })
        .getByRole('button')
        .click()

      await page.waitForSelector('text=Changes saved successfully!')

      await page
        .locator('.speciality')
        .filter({ hasText: 'haircut' })
        .getByRole('button')
        .click()

      await page
        .locator('.specialities-wrapper')
        .getByRole('button', { name: 'Save Changes' })
        .click()

      await page.waitForSelector('text=Changes saved successfully!')

      await expect(page.locator('#Monday-open')).toHaveValue('08:00')
      await expect(page.locator('#Monday-close')).toHaveValue('22:00')
      await expect(page.locator('#Tuesday-operational')).not.toBeChecked()
      await expect(page.getByText('haircut')).not.toBeVisible()
    })
  })

  test('users can edit account details', async ({ page }) => {
    const customer = fakeUser()
    const newCustomer = fakeUser()

    await asUser(page, customer, async () => {
      await page.goto('/account')
      await page.getByLabel('Name').fill(newCustomer.firstName)
      await page.locator('#suraname').fill(newCustomer.lastName)
      await page.getByLabel('Email').fill(newCustomer.email)
      await page
        .locator('form')
        .filter({ hasText: 'NameSurnameEmailPhone number' })
        .getByRole('combobox')
        .selectOption('+371')
      await page.getByLabel('Phone number').fill(newCustomer.phoneNumber)
      await page.locator('form').getByRole('button').click()

      await page.waitForSelector('text=Changes saved successfully!')

      await page.reload()

      await expect(page.getByLabel('Name')).toHaveValue(
        newCustomer.firstName.toLowerCase()
      )
      await expect(page.locator('#suraname')).toHaveValue(
        newCustomer.lastName.toLowerCase()
      )
      await expect(page.getByLabel('Email')).toHaveValue(
        newCustomer.email.toLowerCase()
      )
      await expect(page.getByLabel('Phone number')).toHaveValue(
        newCustomer.phoneNumber
      )
    })
  })
})
