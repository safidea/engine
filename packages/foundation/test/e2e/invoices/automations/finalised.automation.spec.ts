import pdf from 'pdf-parse'
import { AppDto } from '@adapter/api/app/AppDto'
import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'

test.describe('An automation that finalise an invoice document from a template', () => {
  test('should create a PDF document when an invoice is finalised from API request', async ({
    request,
    folder,
    orm,
    storage,
    converter,
  }) => {
    // GIVEN
    const config: AppDto = {
      tables: helpers.getTablesDto('invoices', 'invoices_items', 'entities'),
      automations: helpers.getAutomationsDto('finalised_invoice_with_html_file_template'),
    }
    helpers.copyPrivateTemplate('invoice.html', folder)
    const port = 50801
    const foundation = new Foundation({ adapters: { orm, storage, converter }, port, folder })
    await foundation.config(config).start()
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(orm, 'invoices')

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices/${invoice.id}`), {
      data: {
        status: 'finalised',
      },
    })

    // THEN
    const [record] = await orm.list('invoices')
    expect(record).toBeDefined()
    expect(record.status).toEqual('finalised')
    expect(record.finalised_time).toBeDefined()
    expect(record.number).toBeDefined()
    const [file] = await storage.list('invoices')
    expect(file).toBeDefined()
    expect(file.filename).toEqual('invoice-1001.pdf')
    const data = await pdf(file.data)
    expect(data.text).toContain('Invoice 1001')
    expect(data.text).not.toContain('Preview')
  })
})
