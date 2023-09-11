import pdf from 'pdf-parse'
import { test, expect, helpers, Engine } from '../../../utils/e2e/fixtures'
import { FileStorage } from '@drivers/storage/FileStorage'
import INVOICES_TEMPLATE from '../app'

test.describe('An automation that update an invoice document from a template', () => {
  test('should save the invoice document url updated in the record', async ({
    request,
    folder,
    orm,
    converter,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50701
    const storage = new FileStorage(folder, 'http://localhost:' + port)
    const engine = new Engine({ orm, storage, converter, port, folder })
    await engine.config(INVOICES_TEMPLATE).start()
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, orm, 'invoices', [
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
    const [record] = await orm.list('invoices')
    expect(record.customer).toEqual('Company B')
    const [file] = await storage.list('invoices')
    const data = await pdf(file.data)
    expect(data.text).toContain('Company B')
  })

  test('should update the invoice document from an updated item', async ({
    request,
    folder,
    orm,
    converter,
  }) => {
    // GIVEN
    helpers.copyAppFile('invoices', 'templates/invoice.html', folder)
    const port = 50702
    const storage = new FileStorage(folder, 'http://localhost:' + port)
    const engine = new Engine({ orm, storage, converter, port, folder })
    await engine.config(INVOICES_TEMPLATE).start()
    const {
      invoices_items: [invoice_item],
    } = await helpers.generateRecords(INVOICES_TEMPLATE, orm, 'invoices', [
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
    const [record] = await orm.list('invoices_items')
    expect(record.unit_price).toEqual(253)
    const [file] = await storage.list('invoices')
    const data = await pdf(file.data)
    expect(data.text).toContain('253€')
  })
})
