import pdf from 'pdf-parse'
import { AppDto } from '@adapter/api/app/AppDto'
import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'
import { FileStorage } from '@infrastructure/storage/FileStorage'

test.describe('An automation that build an invoice document from a template', () => {
  test('should throw an error if the automation config is invalid', async ({ orm }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              name: 'update-record',
              type: 'update_record',
              fields: {
                fieldX: 'test',
              },
              table: 'invalid',
              recordId: '1',
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
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: [
        {
          name: 'log-on-startup',
          trigger: {
            event: 'server_started',
          },
          actions: [
            {
              name: 'log',
              type: 'log',
              message: 'App started',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const logger = (message: string) => logs.push(message)
    const port = 50004
    const foundation = new Foundation({ adapters: { logger, orm }, port })
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
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              name: 'log',
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
    const logger = (message: string) => logs.push(message)
    const port = 50002
    const foundation = new Foundation({ adapters: { logger, orm }, port })
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
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_updated',
            table: 'invoices',
          },
          actions: [
            {
              name: 'log',
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
    const logger = (message: string) => logs.push(message)
    const port = 50005
    const foundation = new Foundation({ adapters: { logger, orm }, port })
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
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: [
        {
          name: 'build-invoice',
          trigger: {
            event: 'record_created',
            table: 'invoices',
          },
          actions: [
            {
              name: 'log',
              type: 'log',
              message: 'Invoice created',
            },
          ],
        },
      ],
    }
    const logs: string[] = []
    const logger = (message: string) => logs.push(message)
    const port = 50003
    const foundation = new Foundation({ adapters: { logger, orm }, port })
    await foundation.config(config).start()

    // WHEN
    // We do nothing

    // THEN
    expect(logs).not.toContain('Invoice created')
  })

  test('should create a PDF document when an invoice is created from API request', async ({
    request,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_template'),
    }

    const port = 50006
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
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
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice')
  })

  test('should create an invoice from html template on API request', async ({
    request,
    folder,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50008
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [file] = await storage.list('invoices')
    expect(file).toBeDefined()
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice')
  })

  test('should not run create invoice doc automation if invoice created is not a draft', async ({
    request,
    folder,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50012
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices', [
      {
        status: 'finalised',
      },
    ])

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    await expect(storage.list('invoices')).rejects.toThrow('Bucket "invoices" does not exist')
  })

  test('should create a draft invoice from html template on API request with dynamics tokens', async ({
    request,
    folder,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50009
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    for (const item of items) {
      await request.post(helpers.getUrl(port, '/api/table/invoices_items'), { data: item })
    }
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

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

  test('should save the invoice url created in the record', async ({
    request,
    folder,
    orm,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50010
    const storage = new FileStorage(folder, 'http://localhost:' + port)
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    for (const item of items) {
      await request.post(helpers.getUrl(port, '/api/table/invoices_items'), { data: item })
    }
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [record] = await orm.list('invoices')
    expect(record).toBeDefined()
    expect(record.url).toEqual(`http://localhost:${port}/api/storage/invoices/invoice-P1001.pdf`)
  })

  test('should open the invoice pdf from storage', async ({ request, folder, orm, converter }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('created_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50011
    const storage = new FileStorage(folder, 'http://localhost:' + port)
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto('invoices')

    // WHEN
    for (const item of items) {
      await request.post(helpers.getUrl(port, '/api/table/invoices_items'), { data: item })
    }
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // AND
    const response = await request.get(
      `http://localhost:${port}/api/storage/invoices/invoice-P1001.pdf`
    )

    // THEN
    const contentType = response?.headers()['content-type']
    expect(contentType).toBe('application/pdf')
  })
})
