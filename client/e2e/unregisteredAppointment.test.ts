import { test, expect } from '@playwright/test'
import { fakeUser } from 'utils/fakeData'
import { asOwner, asSpecialist, loginNewSpecialist } from 'utils/api'

test.describe.serial('business can be set up and appointments can be made', () => {
  test('business can invite an employee', async ({ page }) => {
    const specialist = fakeUser()
    const owner = fakeUser()

    await loginNewSpecialist(specialist)

    await asOwner(page, owner, async () => {
      await page.goto('/account')
      await page
        .locator('form')
        .filter({ hasText: 'Add EmployeeSend invite' })
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

  // test('unregistered user can make an appointment', async ({ page }) => {
  //   const customer = fakeUser()
  //   const specialist = fakeUser()
  //   const owner = fakeUser()

  //   await loginNewSpecialist(specialist)

  //   await asOwner(page, owner, async () => {
  //     await page.goto('/account')
  //     await page
  //       .locator('form')
  //       .filter({ hasText: 'Add EmployeeSend invite' })
  //       .locator('#email')
  //       .fill(specialist.email)
  //     await page.getByRole('button', { name: 'Send invite' }).click()
  //   })

  //   await asSpecialist(page, specialist, async () => {
  //     await page.goto('/account')
  //     await page.getByRole('button', { name: 'Accept' }).click()
  //   })

  //   const date = new Date()
  //   date.setDate(date.getDate() + 1)
  //   const formattedDate = date.toISOString().split('T')[0]

  //   await page.goto('/')
  //   await page.locator('select[name="service"]').selectOption('haircut')
  //   await page.locator('select[name="location"]').selectOption('riga')
  //   await page.locator('#date').fill(formattedDate)

  //   await page.getByRole('button', { name: 'Search' }).click()
  //   await page.waitForSelector('.specialist-container');
  //   await expect(page.locator('.specialist-info h3')).toContainText('Haircut');

  //   await page.getByRole('button', { name: '11:00' }).first().click()

  //   await page.getByLabel('Name').fill(customer.firstName)
  //   await page.locator('#suraname').fill(customer.lastName)
  //   await page.getByLabel('Email Address').fill(customer.email)
  //   await page.getByLabel('Phone number').fill(customer.phoneNumber)
  //   await page.getByLabel('Comment').fill('no comment')
  //   await page.getByRole('button', { name: 'Continue' }).click()
  //   await page.getByRole('button', { name: 'Submit' }).click()
  //   await page.getByRole('button', { name: 'Return' }).click()

  //   await asOwner(page, owner, async () => {
  //     await page.goto('/appointments')
  //     await expect(page.getByText('haircut')).toBeVisible()
  //     await expect(page.getByText(customer.firstName)).toBeVisible()
  //     await expect(page.getByText(customer.lastName)).toBeVisible()
  //     await expect(page.getByText(customer.email)).toBeVisible()
  //     await expect(page.getByText(customer.phoneNumber)).toBeVisible()
  //   })

  //   await asSpecialist(page, specialist, async () => {
  //     await page.goto('/appointments')
  //     await expect(page.getByText('haircut')).toBeVisible()
  //     await expect(page.getByText(customer.firstName)).toBeVisible()
  //     await expect(page.getByText(customer.lastName)).toBeVisible()
  //     await expect(page.getByText(customer.email)).toBeVisible()
  //     await expect(page.getByText(customer.phoneNumber)).toBeVisible()
  //   })
  // })

  // test('registered user can make an appointment', async ({ page }) => {
  //   const customer = fakeUser()
  //   const specialist = fakeUser()
  //   const owner = fakeUser()

  //   await loginNewSpecialist(specialist)

  //   await asOwner(page, owner, async () => {
  //     await page.goto('/account')
  //     await page.locator('form').filter({ hasText: 'Add EmployeeSend invite' }).locator('#email').fill(specialist.email);
  //     await page.getByRole('button', { name: 'Send invite' }).click();
  //   })

  //   await asSpecialist(page, specialist, async () => {
  //     await page.goto('/account')
  //     await page.getByRole('button', { name: 'Accept' }).click();
  //   })

  //   const date = new Date();
  //   date.setDate(date.getDate() + 1);
  //   const formattedDate = date.toISOString().split('T')[0];

  //   await page.goto('/')
  //   await page.locator('select[name="service"]').selectOption('haircut');
  //   await page.locator('select[name="location"]').selectOption('riga');
  //   await page.locator('#date').fill(formattedDate);

  //   await page.getByRole('button', { name: 'Search' }).click();
  //   await page.getByRole('button', { name: '08:00' }).first().click();

  //   await page.getByLabel('Name').fill(customer.firstName);
  //   await page.locator('#suraname').fill(customer.lastName);
  //   await page.getByLabel('Email Address').fill(customer.email);
  //   await page.getByLabel('Phone number').fill(customer.phoneNumber);
  //   await page.getByLabel('Comment').fill('no comment');
  //   await page.getByRole('button', { name: 'Continue' }).click();
  //   await page.getByRole('button', { name: 'Submit' }).click();
  //   await page.getByRole('button', { name: 'Return' }).click();

  //   await asOwner(page, owner, async () => {
  //     await page.goto('/appointments')
  //     await expect(page.getByText('haircut')).toBeVisible();
  //     await expect(page.getByText(customer.firstName)).toBeVisible();
  //     await expect(page.getByText(customer.lastName)).toBeVisible();
  //     await expect(page.getByText(customer.email)).toBeVisible();
  //     await expect(page.getByText(customer.phoneNumber)).toBeVisible();
  //   })

  //   await asSpecialist(page, specialist, async () => {
  //     await page.goto('/appointments')
  //     await expect(page.getByText('haircut')).toBeVisible();
  //     await expect(page.getByText(customer.firstName)).toBeVisible();
  //     await expect(page.getByText(customer.lastName)).toBeVisible();
  //     await expect(page.getByText(customer.email)).toBeVisible();
  //     await expect(page.getByText(customer.phoneNumber)).toBeVisible();
  //   })
  // })
})
