import { test, expect, helpers } from '../../utils/fixtures'

test.describe('An api that allow CRUD operations on invoices', () => {
  test('should create a list of invoices', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const { invoices } = helpers.generateRecordsDto('invoices', 2)

    // WHEN
    await request.post('/api/table/invoices', { data: invoices })

    // THEN
    const records = await db.list('invoices')
    expect(records.length).toEqual(2)
    for (let i = 0; i < records.length; i++) {
      expect(records[i].id).toBeDefined()
      expect(records[i].created_time).toBeDefined()
    }
  })

  test('should read an invoice with calculated vat and total', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const tables = await db.createRecords('invoices', [
      {
        items: [
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
        ],
      },
    ])
    const {
      invoices: [{ id }],
    } = tables

    // WHEN
    const res = await request.get(`/api/table/invoices/${id}`)

    // THEN
    const { record } = await res.json()
    expect(record.total_net_amount).toEqual(100)
    expect(record.total_vat).toEqual(20)
    expect(record.total_amount).toEqual(120)
  })

  test('should read a list of invoices from a list of ids', async ({ request, foundation }) => {
    // GIVEN
    // We provide 3 invoices and we get only 2 ids
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const { invoices } = await db.createRecords('invoices', 3)
    const ids = invoices.map((i) => i.id)
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
    const { records } = await res.json()
    expect(records.length).toEqual(2)
    expect(records[0].id).toEqual(ids[0])
    expect(records[1].id).toEqual(ids[1])
  })

  test('should update an invoice', async ({ request, foundation }) => {
    // GIVEN
    // We provide an invoice
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const {
      invoices: [{ id }],
    } = await db.createRecords('invoices', [
      {
        customer: 'Customer A',
      },
    ])

    // WHEN
    // I make a PATCH request to update this invoice
    const update = {
      customer: 'Customer B',
    }
    await request.patch(`/api/table/invoices/${id}`, {
      data: update,
    })

    // THEN
    // The updated invocie should have a new name
    const [updatedRecord] = await db.list('invoices')
    expect(updatedRecord.id).toEqual(id)
    expect(updatedRecord.getFieldValue('customer')).toEqual(update.customer)
    expect(updatedRecord.last_modified_time).toBeDefined()
  })

  test('should soft delete an invoice', async ({ request, foundation }) => {
    // GIVEN
    // We provide an invoice
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const {
      invoices: [{ id }],
    } = await db.createRecords('invoices')

    // WHEN
    // I make a DELETE request to soft delete this invoice
    await request.delete(`/api/table/invoices/${id}`)

    // THEN
    // I should have a deleted_at value on my soft deleted invoice
    const [deletedRecord] = await db.list('invoices')
    expect(deletedRecord.id).toEqual(id)
    expect(deletedRecord.deleted_time).toBeDefined()
  })

  test('should finalised an invoice', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const {
      invoices: [{ id }],
    } = await db.createRecords('invoices')

    // WHEN
    const update = {
      finalised_time: new Date().toISOString(),
      number: 1,
      status: 'finalised',
    }
    await request.patch(`/api/table/invoices/${id}`, {
      data: update,
    })

    // THEN
    const [finalisedRecord] = await db.list('invoices')
    expect(finalisedRecord.id).toEqual(id)
    expect(finalisedRecord.getFieldValue('finalised_time')).toEqual(update.finalised_time)
    expect(finalisedRecord.getFieldValue('number')).toEqual(update.number)
    expect(finalisedRecord.getFieldValue('status')).toEqual(update.status)
  })

  test.skip('should not be able to update a finalised invoice', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const id = await db.createRecords('invoices', [
      {
        customer: 'Customer A',
        status: 'finalised',
        finalised_time: new Date().toISOString(),
        number: 1,
      },
    ])

    // WHEN
    const update = {
      customer: 'Customer B',
      number: 2,
    }
    const res = await request.patch(`/api/table/invoices/${id}`, {
      data: update,
    })

    // THEN
    expect(res.status()).toEqual(400)
    const { error } = await res.json()
    expect(error).toEqual('Cannot update a finalised invoice')
    const [updatedRecord] = await db.list('invoices')
    expect(updatedRecord.id).toEqual(id)
    expect(updatedRecord.getFieldValue('customer')).toEqual('Customer A')
    expect(updatedRecord.getFieldValue('number')).toEqual(1)
  })
})

test.describe('An api that render error messages', () => {
  test('should return a 404 error when the table does not exist', async ({
    request,
    foundation,
  }) => {
    // GIVEN
    // We provide an app with tables
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })

    // WHEN
    // I make a GET request on an unknown table
    const res = await request.get('/api/table/unknown')

    // THEN
    // I should have a 404 error
    expect(res.status()).toEqual(404)
    expect((await res.json()).error).toEqual('Table unknown does not exist')
  })

  test('should return a 404 error when the row does not exist', async ({ request, foundation }) => {
    // GIVEN
    // We provide an app with tables
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })

    // WHEN
    // I make a GET request on an unknown row
    const res = await request.get('/api/table/invoices/unknown')

    // THEN
    // I should have a 404 error
    expect(res.status()).toEqual(404)
    expect((await res.json()).error).toEqual('Record unknown does not exist in table invoices')
  })

  test('should return a 400 error when fields are required', async ({ request, foundation }) => {
    // GIVEN
    // We provide an app with tables
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })

    // WHEN
    // I make a POST request with an invalid row
    const res = await request.post('/api/table/invoices', { data: { customer: 'Essentiel' } })

    // THEN
    // I should have a 400 error
    expect(res.status()).toEqual(400)
    const { error } = await res.json()
    expect(error).toContain('field "address" is required')
    expect(error).toContain('field "zip_code" is required')
    expect(error).toContain('field "country" is required')
    expect(error).toContain('field "items" is required')
  })

  test('should return a 400 error when a field is not valid', async ({ request, foundation }) => {
    // GIVEN
    // We provide an app with tables
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const {
      invoices: [invoice],
    } = helpers.generateRecordsDto('invoices')
    invoice.invalid = 'invalid'

    // WHEN
    // I make a POST request with an invalid row
    const res = await request.post('/api/table/invoices', { data: invoice })

    // THEN
    // I should have a 400 error
    expect(res.status()).toEqual(400)
    const { error } = await res.json()
    expect(error).toContain('Invalid fields: invalid')
  })

  test('should return a 400 error when a record of a multiple linked field is not valid', async ({
    request,
    foundation,
  }) => {
    // GIVEN
    // We provide an app with tables
    await foundation.config({
      tables: helpers.getTablesDto('invoices'),
    })
    const {
      invoices_items: [item],
    } = helpers.generateRecordsDto('invoices', [
      {
        items: [
          {
            quantity: 'test',
          },
        ],
      },
    ])

    // WHEN
    // I make a POST request with an invalid row
    const res = await request.post('/api/table/invoices_items', { data: item })

    // THEN
    // I should have a 400 error
    expect(res.status()).toEqual(400)
    const { error } = await res.json()
    expect(error).toContain('field "quantity" must be a number')
  })
})
