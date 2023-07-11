import { test, expect } from './fixtures'

test.describe('A page that update an invoice', () => {
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

    await expect(companyFieldValue).toHaveValue(invoice.customer)
    await expect(quantityFieldValue).toHaveValue(invoice.quantity.toString())
  })

  test('should update an invoice in realtime', async ({ page, orm, faker }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const invoice = await orm.invoice.create({
      data: faker.generate('invoices'),
    })

    // You'll have to navigate to the page you want to test
    await page.goto(`/update/${invoice.id}`)

    // WHEN
    // We update the invoice data and wait for autosave
    const newCustomerValue = invoice.customer + ' updated'

    // Type the updatedText into the input with name "customer"
    await page.locator('input[name="customer"]').fill(newCustomerValue)

    // Wait for the "Saving..." text to disappear
    await page.waitForSelector(':has-text("Saving...")', { state: 'detached' })

    // THEN
    // The invoice data should be updated in database
    const updatedInvoice = await orm.invoice.findUnique({ where: { id: invoice.id } })

    expect(updatedInvoice.customer).toContain(newCustomerValue)
  })
})
