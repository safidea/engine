import { test, expect } from './fixtures'

test.describe('A page that create an invoices', () => {
  test('should display a title', async ({ page }) => {
    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // THEN
    // Check that I'm on the /create page
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test('should fill a form and redirect to home page', async ({ page, faker }) => {
    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // AND
    // I fill the form
    await page.waitForSelector('input[name="customer"]', { state: 'visible' })
    await page.locator('input[name="customer"]').fill(faker.company.name())
    await page.locator('input[name="customer"]').fill(faker.company.name())
    await page.locator('input[name="address"]').fill(faker.location.streetAddress())
    await page.locator('input[name="zip_code"]').fill(faker.location.zipCode())
    await page.locator('input[name="country"]').fill(faker.location.country())
    await page.locator('input[name="activity"]').fill(faker.commerce.productName())
    await page.locator('input[name="unit"]').fill(faker.commerce.product())
    await page.locator('input[name="quantity"]').fill(faker.number.int(20).toString())
    await page.locator('input[name="unit_price"]').fill(faker.number.int({ max: 500 }).toString())

    // AND
    // I click on the submit button
    await page.locator('button[type="submit"]').click()

    // THEN
    // Wait for the page to be redirected
    await page.waitForURL('/')

    // AND
    // Check that I'm on the home page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })
})
