import { test, expect, helpers } from '@test/e2e/fixtures'
import INVOICES_CONFIG from '@examples/invoices/config'

test.describe('A page that update an invoice', () => {
  test('should display the invoice data', async ({ page }) => {
    // GIVEN
    // An invoice is listed on the home page
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices', [
      {
        status: 'draft',
      },
    ])

    // Go to the homepage
    await page.goto(helpers.getUrl(app.port, '/')) // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('button:has-text("Éditer")') // Assuming the edit button has text "Éditer"
    await page.waitForURL(helpers.getUrl(app.port, `/update/${id}`))

    // THEN
    // The invoice data should be displayed
    const companyFieldValue = await page.locator('input[name="customer"]').inputValue()
    const [invoice] = await app.drivers.database.list('invoices')
    expect(companyFieldValue).toBe(invoice.customer)
    const activityFieldValue = await page
      .locator('input[placeholder="Activité"]')
      .first()
      .inputValue()
    const [invoiceItem] = await app.drivers.database.list('invoices_items')
    expect(activityFieldValue).toBe(invoiceItem.activity)
  })

  test('should update an invoice in realtime', async ({ page }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices', [
      { number: undefined },
    ])

    // You'll have to navigate to the page you want to test
    await page.goto(helpers.getUrl(app.port, `/update/${id}`))

    // WHEN
    // We update the invoice data and wait for autosave
    const [invoice] = await app.drivers.database.list('invoices')
    const updatedCutomer = invoice.customer + ' updated'

    // Type the updatedText into the input with name "customer"
    await page.locator('input[name="customer"]').clear()
    await page.locator('input[name="customer"]').type(updatedCutomer, { delay: 100 })

    // Wait for the "Saving..." text to disappear
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    // The invoice data should be updated in database
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.customer).toContain(updatedCutomer)
  })

  test('should set invoice as finalised', async ({ page }) => {
    // GIVEN
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(app.port, `/update/${id}`))

    // WHEN
    await page.locator('select[name="status"]').selectOption({ label: 'Finalisée' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.status).toBe('finalised')
    expect(updatedInvoice.number).toBeDefined()
    expect(updatedInvoice.finalised_time).toBeDefined()
  })

  test('should set invoice as sent', async ({ page }) => {
    // GIVEN
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(app.port, `/update/${id}`))

    // WHEN
    await page.locator('select[name="status"]').selectOption({ label: 'Envoyée' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.status).toBe('sent')
  })

  test('should set invoice as paid', async ({ page }) => {
    // GIVEN
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(app.port, `/update/${id}`))

    // WHEN
    await page.locator('select[name="status"]').selectOption({ label: 'Payée' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.status).toBe('paid')
  })
})
