import { test, expect, helpers } from '../../../utils/e2e/fixtures'

test.describe('A page that update an invoice', () => {
  test('should display the invoice data', async ({ page, foundation }) => {
    // GIVEN
    // An invoice is listed on the home page
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_list', 'invoices_update'),
    })
    const {
      invoices: [{ id }],
    } = await db.createRecords('invoices', [
      {
        status: 'draft',
      },
    ])

    // Go to the homepage
    await page.goto('/list') // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('button:has-text("Éditer")') // Assuming the edit button has text "Éditer"
    await page.waitForURL(`/update/${id}`)

    // THEN
    // The invoice data should be displayed
    const companyFieldValue = await page.locator('input[name="customer"]').inputValue()
    const [invoice] = await db.list('invoices')
    expect(companyFieldValue).toBe(invoice.getFieldValue('customer'))
    const activityFieldValue = await page
      .locator('input[placeholder="Activité"]')
      .first()
      .inputValue()
    const [invoiceItem] = await db.list('invoices_items')
    expect(activityFieldValue).toBe(invoiceItem.getFieldValue('activity'))
  })

  test.skip('should update an invoice in realtime', async ({ page, foundation }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_update'),
    })
    const {
      invoices: [{ id }],
    } = await db.createRecords('invoices')

    // You'll have to navigate to the page you want to test
    await page.goto(`/update/${id}`)

    // WHEN
    // We update the invoice data and wait for autosave
    const [invoice] = await db.list('invoices')
    const customer = invoice.getFieldValue('customer')
    const update = 'updated '

    // Type the updatedText into the input with name "customer"
    await page.locator('input[name="customer"]').type(update, { delay: 100 })

    // Wait for the "Saving..." text to disappear
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    // The invoice data should be updated in database
    const [updatedInvoice] = await db.list('invoices')
    expect(updatedInvoice.getFieldValue('customer')).toContain(update + customer)
  })
})
