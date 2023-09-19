import pdf from 'pdf-parse'
import { test, expect, helpers, Engine } from '../../../utils/e2e/fixtures'
import INVOICES_TEMPLATE from '../app'

test.describe('An automation that finalise an invoice document from a template', () => {
  test('should create a PDF document when an invoice is finalised from API request', async ({
    request,
    folder,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50801
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices')

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices/${invoice.id}`), {
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
    //expect(file.filename).toEqual('invoice-1001.pdf')
    const data = await pdf(file)
    expect(data.text).toContain('Invoice 1001')
    expect(data.text).not.toContain('Preview')
  })
})
