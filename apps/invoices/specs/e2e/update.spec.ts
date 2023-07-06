import { test, expect } from './fixtures'

test.describe('Invoice update page', () => {
  test.skip('should display the invoice data', async ({ page, faker, orm }) => {
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
    const companyFieldValue = await page.inputValue('input[aria-label="Client"]')
    const quantityFieldValue = await page.inputValue('input[aria-label="Quantité"]')
    const unitPriceFieldValue = await page.inputValue('input[aria-label="Prix unitaire"]')

    expect(companyFieldValue).toContain(invoice.customer)
    expect(quantityFieldValue).toContain(invoice.quantity.toString())
    expect(unitPriceFieldValue).toContain(invoice.unit_price.toString())
  })
})
