import { AppDto } from '@adapter/api/app/AppDto'
import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'

test.describe('An automation that build an invoice document from a template', () => {
  test('should throw an error if the automation config is invalid', async ({ orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              type: 'update_record',
              fields: {
                fieldX: 'test',
              },
              table: 'invalid',
            },
          ],
        },
      ],
    }

    // WHEN
    const call = () => new Foundation({ adapters: { orm } }).config(config)

    // THEN
    expect(call).toThrow('table "invalid" in action "update_record" is not defined in tables')
  })

  test('should run the automation on startup', async ({ orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'log-on-startup',
          trigger: {
            event: 'server_started',
          },
          actions: [
            {
              type: 'log',
              message: 'App started',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const port = 50004
    const foundation = new Foundation({ adapters: { log, orm }, port })
    foundation.config(config)

    // WHEN
    await foundation.start()

    // THEN
    expect(logs).toContain('App started')
  })

  test('should run the automation when an invoice is created from API request', async ({
    request,
    orm,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice created',
            },
          ],
        },
      ],
    }
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices', 1)
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const port = 50002
    const foundation = new Foundation({ adapters: { log, orm }, port })
    await foundation.config(config).start()

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    expect(logs).toContain('Invoice created')
  })

  test('should run the automation when an invoice is updated from API request', async ({
    request,
    orm,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_updated',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice updated',
            },
          ],
        },
      ],
    }
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(orm, 'invoices', 1)
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const port = 50005
    const foundation = new Foundation({ adapters: { log, orm }, port })
    await foundation.config(config).start()

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices/${invoice.id}`), {
      data: {
        customer: invoice.customer + ' updated',
      },
    })

    // THEN
    expect(logs).toContain('Invoice updated')
  })

  test('should not run the action if the trigger did not happen', async ({ orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              type: 'log',
              message: 'Invoice created',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const log = (message: string) => logs.push(message)
    const port = 50003
    const foundation = new Foundation({ adapters: { log, orm }, port })
    await foundation.config(config).start()

    // WHEN
    // We do nothing

    // THEN
    expect(logs).not.toContain('Invoice created')
  })

  test('should create a document when an invoice is created from API request', async ({
    request,
    orm,
    storage,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      automations: helpers.getAutomationsDto('created_invoice'),
    }
    const port = 50006
    const foundation = new Foundation({ adapters: { orm, storage }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices', 1)

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [file] = await storage.list('invoices')
    expect(file).toBeDefined()
    expect(file.filename).toEqual('invoice.pdf')
    expect(file.data).toEqual('<h1>Invoice</h1>')
  })

  test('should create a document when an invoice is created from page form', async ({
    page,
    orm,
    storage,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices'),
      pages: helpers.getPagesDto('invoices_create'),
      automations: helpers.getAutomationsDto('created_invoice'),
    }
    const port = 50007
    const foundation = new Foundation({ adapters: { orm, storage }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    // I go to the create page "/create"
    await page.goto(helpers.getUrl(port, '/create'))

    // AND
    // I fill the form
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
    expect(file.filename).toEqual('invoice.pdf')
    expect(file.data).toEqual('<h1>Invoice</h1>')
  })
})
