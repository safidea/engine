import pdf from 'pdf-parse'
import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'
import { AppDto } from '@adapter/api/app/AppDto'

test.describe('A page that create an invoice', () => {
  test('should display a title', async ({ page, folder, orm }) => {
    // GIVEN
    const port = 50100
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
        tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
        pages: helpers.getPagesDto('invoices_create'),
      })
      .start()

    // WHEN
    await page.goto(helpers.getUrl(port, '/create'))

    // THEN
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test('should fill a form and create an invoice', async ({ page, orm, folder }) => {
    // GIVEN
    // An invoicing app with a create page and an invoice
    const port = 50101
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
        tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
        pages: helpers.getPagesDto('invoices_create'),
      })
      .start()
    const {
      invoices: [invoice],
      invoices_items: items,
      entities: [entity],
    } = helpers.generateRecordsDto('invoices')
    await orm.create('entities', entity)

    // WHEN
    // I go to the create page "/create"
    await page.goto(helpers.getUrl(port, '/create'))

    // AND
    // I fill the form
    await page.locator('select[name="entity"]').selectOption({ label: String(entity.name) })
    await page.locator('input[name="customer"]').type(String(invoice.customer))
    await page.locator('input[name="address"]').type(String(invoice.address))
    await page.locator('input[name="zip_code"]').type(String(invoice.zip_code))
    await page.locator('input[name="city"]').type(String(invoice.city))
    await page.locator('input[name="country"]').type(String(invoice.country))
    for (let i = 0; i < items.length; i++) {
      await page.click('text=Nouvelle ligne')

      const activitySelector = `input[placeholder="Activité"][value=""]`
      const unitySelector = `input[placeholder="Unité"][value=""]`
      const quantitySelector = `input[placeholder="Quantité"][value=""]`
      const unitPriceSelector = `input[placeholder="Prix unitaire"][value=""]`

      await page.locator(activitySelector).type(String(items[i].activity))
      await page.locator(unitySelector).type(String(items[i].unity))
      await page.locator(quantitySelector).type(String(items[i].quantity))
      await page.locator(unitPriceSelector).type(String(items[i].unit_price))
    }

    // AND
    // I click on the submit button
    await page.locator('button[type="submit"]').click()
    await page.getByText('Enregistrement en cours...').waitFor({ state: 'detached' })

    // THEN
    // An invoice should be created
    const [invoiceRecord] = await orm.list('invoices')
    expect(invoiceRecord).toBeDefined()
    expect(invoiceRecord.id).toBeDefined()
    expect(invoiceRecord.entity).toEqual(entity.id)
    expect(invoiceRecord.customer).toEqual(invoice.customer)
    expect(invoiceRecord.address).toEqual(invoice.address)
    expect(invoiceRecord.zip_code).toEqual(invoice.zip_code)
    expect(invoiceRecord.city).toEqual(invoice.city)
    expect(invoiceRecord.country).toEqual(invoice.country)
    expect(invoiceRecord.status).toEqual('draft')
    expect(invoiceRecord.finalised_time).toBeUndefined()

    // AND
    // All invoices items should be created
    const itemsRecords = await orm.list('invoices_items')
    expect(itemsRecords.length).toEqual(items.length)
    for (let i = 0; i < items.length; i++) {
      expect(itemsRecords[i].activity).toEqual(items[i].activity)
      expect(itemsRecords[i].unity).toEqual(items[i].unity)
      expect(itemsRecords[i].quantity).toEqual(items[i].quantity)
      expect(itemsRecords[i].unit_price).toEqual(items[i].unit_price)
    }
  })

  test('should display an error message when some required fields are not provided', async ({
    page,
    folder,
  }) => {
    // GIVEN
    const port = 50102
    await new Foundation({ port, folder })
      .config({
        tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
        pages: helpers.getPagesDto('invoices_create'),
      })
      .start()
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    await page.goto(helpers.getUrl(port, '/create'))

    // AND
    await page.locator('input[name="customer"]').type(String(invoice.customer))

    // AND
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector(':has-text("Enregistrement en cours...")', { state: 'detached' })

    // THEN
    const errorExist = await page.$('text=field "address" is required')
    expect(errorExist).toBeTruthy()
  })

  test('should create a PDF document when an invoice is created from a form and a template', async ({
    page,
    folder,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      pages: helpers.getPagesDto('invoices_create'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50103
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
      invoices_items: items,
      entities: [entity],
    } = helpers.generateRecordsDto('invoices')
    await orm.create('entities', entity)

    // WHEN
    // I go to the create page "/create"
    await page.goto(helpers.getUrl(port, '/create'))

    // AND
    // I fill the form
    await page.locator('select[name="entity"]').selectOption({ label: String(entity.name) })
    await page.locator('input[name="customer"]').type(String(invoice.customer))
    await page.locator('input[name="address"]').type(String(invoice.address))
    await page.locator('input[name="zip_code"]').type(String(invoice.zip_code))
    await page.locator('input[name="city"]').type(String(invoice.city))
    await page.locator('input[name="country"]').type(String(invoice.country))
    for (let i = 0; i < items.length; i++) {
      await page.click('text=Nouvelle ligne')

      const activitySelector = `input[placeholder="Activité"][value=""]`
      const unitySelector = `input[placeholder="Unité"][value=""]`
      const quantitySelector = `input[placeholder="Quantité"][value=""]`
      const unitPriceSelector = `input[placeholder="Prix unitaire"][value=""]`

      await page.locator(activitySelector).type(String(items[i].activity))
      await page.locator(unitySelector).type(String(items[i].unity))
      await page.locator(quantitySelector).type(String(items[i].quantity))
      await page.locator(unitPriceSelector).type(String(items[i].unit_price))
    }

    // AND
    // I click on the submit button
    await page.locator('button[type="submit"]').click()
    await page.getByText('Enregistrement en cours...').waitFor({ state: 'detached' })

    // THEN
    const [file] = await storage.list('invoices')
    expect(file).toBeDefined()
    expect(file.filename).toEqual('invoice-P1001.pdf')
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice P1001')
    expect(data.text).toContain('Preview')
    expect(data.text).toContain(invoice.customer)
    for (const item of items) {
      expect(data.text).toContain(item.activity)
    }
  })
})
