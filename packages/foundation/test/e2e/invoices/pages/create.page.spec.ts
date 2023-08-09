import { test, expect, helpers } from '../../../utils/e2e/fixtures'

test.describe('A page that create an invoice', () => {
  test('should display a title', async ({ page, foundation }) => {
    // GIVEN
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_create'),
    })

    // WHEN
    await page.goto('/create')

    // THEN
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test('should fill a form and create an invoice', async ({ page, foundation }) => {
    // GIVEN
    // An invoicing app with a create page and an invoice
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_create'),
    })
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecords('invoices')

    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // AND
    // I fill the form
    await page.locator('input[name="customer"]').type(String(invoice.getFieldValue('customer')))
    await page.locator('input[name="address"]').type(String(invoice.getFieldValue('address')))
    await page.locator('input[name="zip_code"]').type(String(invoice.getFieldValue('zip_code')))
    await page.locator('input[name="city"]').type(String(invoice.getFieldValue('city')))
    await page.locator('input[name="country"]').type(String(invoice.getFieldValue('country')))
    for (let i = 0; i < items.length; i++) {
      await page.click('text=Nouvelle ligne')

      const activitySelector = `input[placeholder="Activité"][value=""]`
      const unitySelector = `input[placeholder="Unité"][value=""]`
      const quantitySelector = `input[placeholder="Quantité"][value=""]`
      const unitPriceSelector = `input[placeholder="Prix unitaire"][value=""]`

      await page.locator(activitySelector).type(String(items[i].getFieldValue('activity')))
      await page.locator(unitySelector).type(String(items[i].getFieldValue('unity')))
      await page.locator(quantitySelector).type(String(items[i].getFieldValue('quantity')))
      await page.locator(unitPriceSelector).type(String(items[i].getFieldValue('unit_price')))
    }

    // AND
    // I click on the submit button
    await page.locator('button[type="submit"]').click()
    await page.getByText('Enregistrement en cours...').waitFor({ state: 'detached' })

    // THEN
    // An invoice should be created
    const [invoiceRecord] = await db.list('invoices')
    expect(invoiceRecord).toBeDefined()
    expect(invoiceRecord.id).toBeDefined()
    expect(invoiceRecord.getFieldValue('customer')).toEqual(invoice.getFieldValue('customer'))
    expect(invoiceRecord.getFieldValue('address')).toEqual(invoice.getFieldValue('address'))
    expect(invoiceRecord.getFieldValue('zip_code')).toEqual(invoice.getFieldValue('zip_code'))
    expect(invoiceRecord.getFieldValue('city')).toEqual(invoice.getFieldValue('city'))
    expect(invoiceRecord.getFieldValue('country')).toEqual(invoice.getFieldValue('country'))
    expect(invoiceRecord.getFieldValue('status')).toEqual('draft')
    expect(invoiceRecord.getFieldValue('finalised_time')).toBeUndefined()

    // AND
    // All invoices items should be created
    const itemsRecords = await db.list('invoices_items')
    expect(itemsRecords.length).toEqual(items.length)
    for (let i = 0; i < items.length; i++) {
      expect(itemsRecords[i].getFieldValue('activity')).toEqual(items[i].getFieldValue('activity'))
      expect(itemsRecords[i].getFieldValue('unity')).toEqual(items[i].getFieldValue('unity'))
      expect(itemsRecords[i].getFieldValue('quantity')).toEqual(items[i].getFieldValue('quantity'))
      expect(itemsRecords[i].getFieldValue('unit_price')).toEqual(
        items[i].getFieldValue('unit_price')
      )
    }
  })

  test('should display an error message when some required fields are not provided', async ({
    page,
    foundation,
  }) => {
    // GIVEN
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_create'),
    })
    const {
      invoices: [invoice],
    } = helpers.generateRecords('invoices')

    // WHEN
    await page.goto('/create')

    // AND
    await page.locator('input[name="customer"]').type(String(invoice.getFieldValue('customer')))

    // AND
    await page.locator('button[type="submit"]').click()
    await page.waitForSelector(':has-text("Enregistrement en cours...")', { state: 'detached' })

    // THEN
    const errorExist = await page.$('text=field "address" is required')
    expect(errorExist).toBeTruthy()
  })
})
