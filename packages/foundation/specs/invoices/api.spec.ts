import { RecordDto } from '@application/dtos/RecordDto'
import { test, expect } from '../fixtures'

test.describe('An api that allow CRUD operations on invoices', () => {
  test('should create a list of invoices', async ({ request, app, helpers }) => {
    // GIVEN
    const db = await app.start({
      tables: helpers.getTableSchema('invoices'),
    })
    const invoices = helpers.generateArrayTableData('invoices', 2)

    // WHEN
    const res = await request.post('/api/table/invoices', { data: invoices })

    // THEN
    expect(res.status()).toEqual(200)
    const rows = await db.list('invoices')
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i].id).toBeDefined()
      expect(rows[i].created_time).toBeDefined()
    }
  })

  test.skip('should read an invoice with calculated vat and total', async ({
    request,
    app,
    helpers,
  }) => {
    // GIVEN
    const db = await app.start({
      tables: helpers.getTableSchema('invoices'),
    })
    const invoice = helpers.generateTableData('invoices', {
      items: helpers.generateArrayTableData('invoices_items', [
        {
          quantity: 4,
          unit_price: 20,
          vat: 0.2,
        },
        {
          quantity: 2,
          unit_price: 10,
          vat: 0.2,
        },
      ]),
    })
    const { id } = await db.create('invoices', invoice)

    // WHEN
    const res = await request.get(`/api/table/invoices/${id}`)

    // THEN
    expect(res.status()).toEqual(200)
    const record: RecordDto = await res.json()
    console.log(record)
    expect(record.total_net_amount).toEqual(100)
    expect(record.total_vat).toEqual(20)
    expect(record.total_amount).toEqual(120)
  })

  /*test('should read a list of rows from a list of ids', async ({ request, app, helpers }) => {
    // GIVEN
    // We provide 3 invoices and we get only 2 ids
    const db = await app.start({
      tables: [helpers.getTableSchema('invoices')],
    })
    const invoices = helpers.generateTableRecord('invoices', 3)
    const ids = []
    for (let i = 0; i < invoices.length; i++) {
      const data = { ...invoices[i], items: { create: invoices[i].items } }
      invoices[i] = await db.create('invoices_items', data)
      if (i < invoices.length - 1) ids.push(invoices[i].id)
    }

    // WHEN
    // I make a GET request on table invoices
    const res = await request.get(
      `/api/table/invoices?filter_key_0=id&filter_operator_0=is_any_of&filter_value_0=${ids.join(
        ','
      )}`
    )

    // THEN
    // I have read 2 invoices
    expect(res.status()).toEqual(200)
    const rows = await res.json()
    expect(rows.length).toEqual(2)
    expect(rows[0].id).toEqual(invoices[0].id)
    expect(rows[1].id).toEqual(invoices[1].id)
  })

  test('should update a row', async ({ request, orm, faker }) => {
    // GIVEN
    // We provide an invoice
    const [invoice] = faker.generate('invoices', 1)
    const data = { ...invoice, items: { create: invoice.items } }
    const row = await orm.invoice.create({ data })

    // WHEN
    // I make a PATCH request to update this invoice
    const update = {
      customer: faker.company.name(),
    }
    const res = await request.patch(`/api/table/invoices/${row.id}`, {
      data: update,
    })

    // THEN
    // The updated invocie should have a new name
    expect(res.status()).toEqual(200)
    const updatedRow = await orm.invoice.findUniqueOrThrow({ where: { id: row.id } })
    expect(updatedRow.id).toEqual(row.id)
    expect(updatedRow.customer).toEqual(update.customer)
    expect(updatedRow.updated_at).toBeDefined()
  })

  test('should soft delete a row', async ({ request, orm, faker }) => {
    // GIVEN
    // We provide an invoice
    const [invoice] = faker.generate('invoices', 1)
    const data = { ...invoice, items: { create: invoice.items } }
    const row = await orm.invoice.create({ data })

    // WHEN
    // I make a DELETE request to soft delete this invoice
    const res = await request.delete(`/api/table/invoices/${row.id}`)

    // THEN
    // I should have a deleted_at value on my soft deleted invoice
    expect(res.status()).toEqual(200)
    const deletedRow = await orm.invoice.findUniqueOrThrow({ where: { id: row.id } })
    expect(deletedRow.id).toEqual(row.id)
    expect(deletedRow.deleted_at).toBeDefined()
  })*/
})

test.describe('An api that render error messages', () => {
  /*test('should return a 404 error when the table does not exist', async ({ request }) => {
    // WHEN
    // I make a GET request on an unknown table
    const res = await request.get('/api/table/unknown')

    // THEN
    // I should have a 404 error
    expect(res.status()).toEqual(404)
    expect((await res.json()).error).toEqual('Table unknown does not exist')
  })

  test('should return a 404 error when the row does not exist', async ({ request }) => {
    // WHEN
    // I make a GET request on an unknown row
    const res = await request.get('/api/table/invoices/unknown')

    // THEN
    // I should have a 404 error
    expect(res.status()).toEqual(404)
    expect((await res.json()).error).toEqual('Row unknown does not exist in table invoices')
  })

  test('should return a 400 error when the row is not valid', async ({ request }) => {
    // WHEN
    // I make a POST request with an invalid row
    const res = await request.post('/api/table/invoices', { data: { invalid: 'invalid' } })

    // THEN
    // I should have a 400 error
    expect(res.status()).toEqual(400)
    const { error, details } = await res.json()
    expect(error).toEqual('Invalid row')
    expect(details).toContain('Invalid fields: invalid')
  })*/
})
