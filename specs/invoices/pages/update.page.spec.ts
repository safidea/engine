import { test, expect, helpers, Engine } from '../../../test/e2e/fixtures'
import INVOICES_TEMPLATE from '../schema'

test.describe('A page that update an invoice', () => {
  test('should display the invoice data', async ({ page, folder }) => {
    // GIVEN
    // An invoice is listed on the home page
    const port = 50401
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)

    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices', [
      {
        status: 'draft',
      },
    ])

    // Go to the homepage
    await page.goto(helpers.getUrl(port, '/')) // replace with the URL of your app's home page

    // WHEN
    // The user clicks on an invoice
    await page.click('button:has-text("Éditer")') // Assuming the edit button has text "Éditer"
    await page.waitForURL(helpers.getUrl(port, `/update/${id}`))

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

  test('should update an invoice in realtime', async ({ page, folder }) => {
    // GIVEN
    // An invoice is loaded in the update page
    const port = 50402
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)

    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices', [
      { number: undefined },
    ])

    // You'll have to navigate to the page you want to test
    await page.goto(helpers.getUrl(port, `/update/${id}`))

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

  test('should set invoice as finalised', async ({ page, folder }) => {
    // GIVEN
    const port = 50403
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(port, `/update/${id}`))

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

  test('should set invoice as sent', async ({ page, folder }) => {
    // GIVEN
    const port = 50404
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)

    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(port, `/update/${id}`))

    // WHEN
    await page.locator('select[name="status"]').selectOption({ label: 'Envoyée' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.status).toBe('sent')
  })

  test('should set invoice as paid', async ({ page, folder }) => {
    // GIVEN
    const port = 50405
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)

    const {
      invoices: [{ id }],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices')
    await page.goto(helpers.getUrl(port, `/update/${id}`))

    // WHEN
    await page.locator('select[name="status"]').selectOption({ label: 'Payée' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'attached' })
    await page.getByText('Mise à jour en cours...').waitFor({ state: 'detached' })

    // THEN
    const [updatedInvoice] = await app.drivers.database.list('invoices')
    expect(updatedInvoice.status).toBe('paid')
  })
})
