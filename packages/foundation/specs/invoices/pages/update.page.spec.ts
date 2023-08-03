import { test, expect, helpers } from '../../utils/fixtures'

test.describe('A page that update an invoice', () => {
  test.skip('should display the invoice data', async ({ page, foundation }) => {
    // GIVEN
    // An invoice is listed on the home page
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_list', 'invoices_update'),
    })
    const invoiceId = await db.createRecord('invoices', {
      status: 'draft',
    })

    // Go to the homepage
    await page.goto('/list') // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('button:has-text("Éditer")') // Assuming the edit button has text "Éditer"
    await page.waitForURL(`/update/${invoiceId}`)

    // THEN
    // The invoice data should be displayed
    const companyFieldValue = await page.locator('input[name="customer"]').inputValue()
    const [invoice] = await db.list('invoices')
    expect(companyFieldValue).toBe(invoice.customer)
  })

  test.skip('should update an invoice in realtime', async ({ page, foundation }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_update'),
    })
    const invoiceId = await db.createRecord('invoices')

    // You'll have to navigate to the page you want to test
    await page.goto(`/update/${invoiceId}`)

    // WHEN
    // We update the invoice data and wait for autosave
    const [invoice] = await db.list('invoices')
    const newCustomerValue = invoice.customer + ' updated'

    // Type the updatedText into the input with name "customer"
    await page.locator('input[name="customer"]').fill(newCustomerValue)

    // Wait for the "Saving..." text to disappear
    await page.waitForSelector(':has-text("Saving...")', { state: 'detached' })

    // THEN
    // The invoice data should be updated in database
    const [updatedInvoice] = await db.list('invoices')
    expect(updatedInvoice.customer).toContain(newCustomerValue)
  })
})
