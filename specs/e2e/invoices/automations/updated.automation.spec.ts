import pdf from 'pdf-parse'
import { test, expect, helpers, Engine } from '../../../utils/e2e/fixtures'
import INVOICES_TEMPLATE from '../schema'

test.describe('An automation that update an invoice document from a template', () => {
  test('should save the invoice document url updated in the record', async ({
    request,
    folder,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50701
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices', [
      {
        customer: 'Company A',
      },
    ])

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices/${invoice.id}`), {
      data: {
        customer: 'Company B',
      },
    })

    // THEN
    const [record] = await app.drivers.database.list('invoices')
    expect(record.customer).toEqual('Company B')
    const [file] = await app.drivers.storage.list('invoices')
    const data = await pdf(file.data)
    expect(data.text).toContain('Company B')
  })

  test('should update the invoice document from an updated item', async ({ request, folder }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50702
    const app = await new Engine({ port, folder }).start(INVOICES_TEMPLATE)
    const {
      invoices_items: [invoice_item],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, app.drivers.database, 'invoices', [
      {
        items: [
          {
            unit_price: 10,
          },
        ],
      },
    ])

    // WHEN
    await request.patch(helpers.getUrl(port, `/api/table/invoices_items/${invoice_item.id}`), {
      data: {
        unit_price: 253,
      },
    })

    // THEN
    const [record] = await app.drivers.database.list('invoices_items')
    expect(record.unit_price).toEqual(253)
    const [file] = await app.drivers.storage.list('invoices')
    const data = await pdf(file.data)
    expect(data.text).toContain('253€')
  })
})
