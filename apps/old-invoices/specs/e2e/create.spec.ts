import { test, expect } from './fixtures'

test.describe('A page that create an invoice', () => {
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
    const invoice = faker.generate('invoices')
    await page.waitForSelector('input[name="customer"]', { state: 'visible' })
    await page.locator('input[name="customer"]').fill(invoice.customer)
    await page.locator('input[name="address"]').fill(invoice.address)
    await page.locator('input[name="zip_code"]').fill(invoice.zip_code)
    await page.locator('input[name="country"]').fill(invoice.country)
    for (let i = 0; i < invoice.items.length; i++) {
      await page.click('text=Nouvelle ligne')

      const activitySelector = `input[placeholder="Activité"][value=""]`
      const unitySelector = `input[placeholder="Unité"][value=""]`
      const quantitySelector = `input[placeholder="Quantité"][value=""]`
      const unitPriceSelector = `input[placeholder="Prix unitaire"][value=""]`

      await page.locator(activitySelector).fill(invoice.items[i].activity)
      await page.locator(unitySelector).fill(invoice.items[i].unity)
      await page.locator(quantitySelector).fill(String(invoice.items[i].quantity))
      await page.locator(unitPriceSelector).fill(String(invoice.items[i].unit_price))
    }

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
