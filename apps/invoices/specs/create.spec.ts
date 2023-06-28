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
    await page.fill('input[name="customer"]', 'ESSENTIAL SERVICE')
    await page.fill('input[name="address"]', '128 RUE LA BÉOTIE 75008 PARIS')
    await page.fill('input[name="postal_code"]', '75008')
    await page.fill('input[name="postal_code"]', '75008')

    await page.fill('input[name="activity"]', 'CTO Low Code - Conseil et Développement')
    await page.fill('input[name="unit"]', 'heure')
    await page.fill('input[name="quantity"]', '1')
    await page.fill('input[name="unit_price"]', '1000')

    // AND
    // I click on the submit button
    await page.click('button[type="submit"]')

    // THEN
    // Wait for the page to be redirected
    await page.waitForURL('/')

    // AND
    // Check that I'm on the home page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })
})
