import { test, expect } from './fixtures'

test.describe('A page that update an invoice', () => {
  test('should display the invoice data', async ({ page, faker, orm }) => {
    // GIVEN
    // An invoice is listed on the home page
    const invoice = faker.generate('invoices')
    const data = { ...invoice, items: { create: invoice.items } }
    const row = await orm.invoice.create({ data })

    // Go to the homepage
    await page.goto('/') // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('a:has-text("Éditer")') // Assuming the edit button has text "Éditer"

    // Go to the update page
    await page.goto(`/update/${row.id}`) // replace with the URL of your app's update page

    // THEN
    // The invoice data should be displayed
    const companyFieldValue = await page.locator('input[name="customer"]').inputValue()
    expect(companyFieldValue).toBe(row.customer)
  })

  test.skip('should update an invoice in realtime', async ({ page, orm, faker }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const invoice = faker.generate('invoices')
    const data = { ...invoice, items: { create: invoice.items } }
    const row = await orm.invoice.create({ data })

    // You'll have to navigate to the page you want to test
    await page.goto(`/update/${row.id}`)

    // WHEN
    // We update the invoice data and wait for autosave
    const newCustomerValue = row.customer + ' updated'

    // Type the updatedText into the input with name "customer"
    await page.locator('input[name="customer"]').fill(newCustomerValue)

    // Wait for the "Saving..." text to disappear
    await page.waitForSelector(':has-text("Saving...")', { state: 'detached' })

    // THEN
    // The invoice data should be updated in database
    const updatedInvoice = await orm.invoice.findUnique({ where: { id: row.id } })

    expect(updatedInvoice.customer).toContain(newCustomerValue)
  })
})
