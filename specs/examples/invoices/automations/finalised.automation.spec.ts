import pdf from 'pdf-parse'
import { test, expect, helpers } from '@test/e2e/fixtures'
import INVOICES_CONFIG from '@examples/invoices/config'

test.describe('An automation that finalise an invoice document from a template', () => {
  test('should create a PDF document when an invoice is finalised from API request', async ({
    request,
  }) => {
    // GIVEN
    const app = await helpers.startApp(INVOICES_CONFIG)
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(INVOICES_CONFIG, app.drivers.database, 'invoices')

    // WHEN
    await request.patch(helpers.getUrl(app.port, `/api/table/invoices/${invoice.id}`), {
      data: {
        status: 'finalised',
      },
    })

    // THEN
    const [record] = await app.drivers.database.list('invoices')
    expect(record).toBeDefined()
    expect(record.status).toEqual('finalised')
    expect(record.finalised_time).toBeDefined()
    expect(record.number).toBeDefined()
    const [file] = await app.drivers.storage.list('invoices')
    expect(file).toBeDefined()
    expect(file.filename).toEqual('invoice-1001.pdf')
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice 1001')
    expect(data.text).not.toContain('Preview')
  })
})
