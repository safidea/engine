import { test, expect } from '@playwright/test'

test.describe('A page that create an invoices', () => {
  test('should display a title', async ({ page }) => {
    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // THEN
    // Check that I'm on the /create page
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test.skip('should fill a form and redirect to home page', async ({ page }) => {
    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // AND
    // I fill the form
    await page.fill('input[name="address"]', 'Test')

    // AND
    // I click on the submit button
    await page.click('button[type="submit"]')

    // THEN
    // Wait for the page to be redirected
    await page.waitForTimeout(5000)

    // AND
    // Check that I'm on the home page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })
})
