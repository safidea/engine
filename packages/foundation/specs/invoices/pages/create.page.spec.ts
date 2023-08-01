import { RecordToCreateDto } from '@application/dtos/table/RecordDto'
import { test, expect, helpers } from '../../utils/fixtures'

test.describe('A page that create an invoice', () => {
  test('should display a title', async ({ page, foundation }) => {
    // GIVEN
    await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_create'),
    })

    // WHEN
    await page.goto('/create')

    // THEN
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test.skip('should fill a form and create an invoice', async ({ page, foundation }) => {
    // GIVEN
    // An invoicing app with a create page
    await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_list', 'invoices_create'),
    })

    // WHEN
    // I go to the create page "/create"
    await page.goto('/create')

    // AND
    // I fill the form
    const invoice = helpers.generateRecord('invoices')
    await page.waitForSelector('input[name="customer"]', { state: 'visible' })
    await page.locator('input[name="customer"]').fill(invoice.customer as string)
    await page.locator('input[name="address"]').fill(invoice.address as string)
    await page.locator('input[name="zip_code"]').fill(invoice.zip_code as string)
    await page.locator('input[name="country"]').fill(invoice.country as string)
    /*for (let i = 0; i < invoice.items?.create?.length; i++) {
      await page.click('text=Nouvelle ligne')

      const activitySelector = `input[placeholder="Activité"][value=""]`
      const unitySelector = `input[placeholder="Unité"][value=""]`
      const quantitySelector = `input[placeholder="Quantité"][value=""]`
      const unitPriceSelector = `input[placeholder="Prix unitaire"][value=""]`

      await page.locator(activitySelector).fill(invoice.items[i].activity)
      await page.locator(unitySelector).fill(invoice.items[i].unity)
      await page.locator(quantitySelector).fill(String(invoice.items[i].quantity))
      await page.locator(unitPriceSelector).fill(String(invoice.items[i].unit_price))
    }*/

    // AND
    // I click on the submit button
    await page.locator('button[type="submit"]').click()

    // THEN
    // Wait for the page to be redirected
    await page.waitForURL('/')

    // AND
    // Check that I'm on the home page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })
})
