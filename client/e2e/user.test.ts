import { test, expect } from '@playwright/test'
import { fakeUser } from 'utils/fakeData'

const user = fakeUser()

test.describe.serial('signup and login sequence', () => {

  test('visitor can signup', async ({ page }) => {

    await page.goto('/signup');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByLabel('Email Address').click();
    await page.getByLabel('Email Address').fill(user.email);
    await page.getByLabel('Email Address').press('Tab');
    await page.getByLabel('Password', { exact: true }).fill(user.password);
    await page.getByLabel('Password', { exact: true }).press('Tab');
    await page.getByLabel('Repeat password').fill(user.password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('Name').click();
    await page.getByLabel('Name').fill(user.firstName);
    await page.getByLabel('Name').press('Tab');
    await page.locator('#suraname').fill(user.lastName);
    await page.getByLabel('Phone number').click();
    await page.getByLabel('Phone number').fill(user.phoneNumber);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.getByLabel('Email Address').click();
    await page.getByLabel('Email Address').fill(user.email);
    await page.getByLabel('Email Address').press('Tab');
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
  })

})

