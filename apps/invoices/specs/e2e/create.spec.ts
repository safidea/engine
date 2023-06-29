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
    /*await page.fill('input[name="customer"]', faker.company.name())
    await page.fill('input[name="address"]', faker.location.streetAddress())
    await page.fill('input[name="zip_code"]', faker.location.zipCode())
    await page.fill('input[name="country"]', faker.location.country())
    await page.fill('input[name="activity"]', faker.commerce.productName())
    await page.fill('input[name="unit"]', faker.commerce.product())*/
    //await page.fill('input[name="quantity"]', faker.number.int(20))
    //await page.fill('input[name="unit_price"]', faker.number.int({ max: 500 }))

    // AND
    // I click on the submit button
    await page.waitForSelector('button[role="submit"]', { state: 'visible' })
    await page.locator('button[role="submit"]').click()

    // THEN
    // Wait for the page to be redirected
    //await page.waitForURL('/')
    await page.waitForSelector('h1:has-text("Toutes les factures")', { state: 'visible' })

    // AND
    // Check that I'm on the home page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })
})
