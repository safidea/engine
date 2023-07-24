import { test, expect, helpers } from '../fixtures'

test.describe('An api that allow CRUD operations on invoices', () => {
  test('should create a list of invoices', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
    })
    const invoices = helpers.generateManyRecords('invoices', 2)

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

  test('should read an invoice with calculated vat and total', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
    })
    const id = await db.createRecord('invoices', {
      items: {
        create: helpers.generateManyRecords('invoices_items', [
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
      },
    })

    // WHEN
    const res = await request.get(`/api/table/invoices/${id}`)

    // THEN
    expect(res.status()).toEqual(200)
    const record = await res.json()
    expect(record.total_net_amount).toEqual(100)
    expect(record.total_vat).toEqual(20)
    expect(record.total_amount).toEqual(120)
  })

  test('should read a list of rows from a list of ids', async ({ request, foundation }) => {
    // GIVEN
    // We provide 3 invoices and we get only 2 ids
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
    })
    const ids = await db.createManyRecords('invoices', 3)
    const filteredIds = ids.slice(0, 2)

    // WHEN
    // I make a GET request on table invoices
    const res = await request.get(
      `/api/table/invoices?filter_field_0=id&filter_operator_0=is_any_of&filter_value_0=${filteredIds.join(
        ','
      )}`
    )

    // THEN
    // I have read 2 invoices
    expect(res.status()).toEqual(200)
    const rows = await res.json()
    expect(rows.length).toEqual(2)
    expect(rows[0].id).toEqual(ids[0])
    expect(rows[1].id).toEqual(ids[1])
  })

  test('should update a row', async ({ request, foundation }) => {
    // GIVEN
    // We provide an invoice
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
    })
    const id = await db.createRecord('invoices', {
      customer: 'Customer A',
    })

    // WHEN
    // I make a PATCH request to update this invoice
    const update = {
      customer: 'Customer B',
    }
    const res = await request.patch(`/api/table/invoices/${id}`, {
      data: update,
    })

    // THEN
    // The updated invocie should have a new name
    expect(res.status()).toEqual(200)
    const [updatedRecord] = await db.list('invoices')
    expect(updatedRecord.id).toEqual(id)
    expect(updatedRecord.customer).toEqual(update.customer)
    expect(updatedRecord.last_modified_time).toBeDefined()
  })

  test('should soft delete a row', async ({ request, foundation }) => {
    // GIVEN
    // We provide an invoice
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
    })
    const id = await db.createRecord('invoices')

    // WHEN
    // I make a DELETE request to soft delete this invoice
    const res = await request.delete(`/api/table/invoices/${id}`)

    // THEN
    // I should have a deleted_at value on my soft deleted invoice
    expect(res.status()).toEqual(200)
    const [deletedRow] = await db.list('invoices')
    expect(deletedRow.id).toEqual(id)
    expect(deletedRow.deleted_time).toBeDefined()
  })
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
