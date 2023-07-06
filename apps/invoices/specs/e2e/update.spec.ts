import { test, expect } from './fixtures'

test.describe('Invoice update page', () => {
  test('should display the invoice data', async ({ page, faker, orm }) => {
    // GIVEN
    // An invoice is listed on the home page
    const invoice = faker.generate('invoices')

    // Assuming that the row is created and the web server is running
    const row = await orm.invoice.create({
      data: invoice,
    })

    // Go to the homepage
    await page.goto('/') // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('a:has-text("Éditer")') // Assuming the edit button has text "Éditer"

    // Go to the update page
    await page.goto(`/update/${row.id}`) // replace with the URL of your app's update page

    // THEN
    // The invoice data should be displayed
    const companyFieldValue = page.locator('input[name="customer"]')
    const quantityFieldValue = page.locator('input[name="quantity"]')
    const unitPriceFieldValue = page.locator('input[name="unit_price"]')

    await expect(companyFieldValue).toHaveValue(invoice.customer)
    await expect(quantityFieldValue).toHaveValue(invoice.quantity.toString())
    await expect(unitPriceFieldValue).toHaveValue(invoice.unit_price.toString())
  })
})
