import pdf from 'pdf-parse'
import { test, expect, helpers, Engine } from '../../../utils/e2e/fixtures'
import INVOICES_TEMPLATE from '../app'

test.describe('An automation that build an invoice document from a template', () => {
  test('should create an invoice from html template on API request', async ({
    request,
    folder,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50008
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto(INVOICES_TEMPLATE, 'invoices')

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [file] = await app.drivers.storage.list('invoices')
    expect(file).toBeDefined()
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice')
  })

  test('should not run create invoice doc automation if invoice created is not a draft', async ({
    request,
    folder,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50012
    const app = await new Engine({ folder, port }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto(INVOICES_TEMPLATE, 'invoices', [
      {
        status: 'finalised',
      },
    ])

    // WHEN
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    await expect(app.drivers.storage.list('invoices')).rejects.toThrow(
      'Bucket "invoices" does not exist'
    )
  })

  test('should create a draft invoice from html template on API request with dynamics tokens', async ({
    request,
    folder,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50009
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto(INVOICES_TEMPLATE, 'invoices')

    // WHEN
    for (const item of items) {
      await request.post(helpers.getUrl(port, '/api/table/invoices_items'), { data: item })
    }
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [file] = await app.drivers.storage.list('invoices')
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

  test('should save the invoice url created in the record', async ({ request, folder }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50010
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto(INVOICES_TEMPLATE, 'invoices')

    // WHEN
    for (const item of items) {
      await request.post(helpers.getUrl(port, '/api/table/invoices_items'), { data: item })
    }
    await request.post(helpers.getUrl(port, '/api/table/invoices'), { data: invoice })

    // THEN
    const [record] = await app.drivers.database.list('invoices')
    expect(record).toBeDefined()
    expect(record.url).toEqual(`http://localhost:${port}/api/storage/invoices/invoice-P1001.pdf`)
  })

  test('should open the invoice pdf from storage', async ({ request, folder }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50011
    await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
      invoices_items: items,
    } = helpers.generateRecordsDto(INVOICES_TEMPLATE, 'invoices')

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
