import { test, expect } from './fixtures'

test.describe('An api that allow CRUD operations on invoices', () => {
  test('should create a list of rows', async ({ request, db }) => {
    // GIVEN
    // We create 2 invoices
    const invoices = [
      { title: 'Facture 1', amount: 1000 },
      { title: 'Facture 2', amount: 2000 },
    ]

    // WHEN
    // I make a POST request with 2 invoices
    await request.post('/api/table/invoices', { data: invoices })

    // THEN
    // I have created 2 invoices
    const rows = await db.invoice.findMany({
      where: { title: { in: invoices.map((i) => i.title) } },
    })
    for (let i = 0; i > rows.length; i++) {
      expect(rows[i].id).toBeDefined()
      expect(rows[i].created_at).toBeDefined()
      expect(rows[i].title).toEqual(invoices[i].title)
    }
  })

  test('should read a list of rows from a list of ids', async ({ request, db }) => {
    // GIVEN
    // We provide 3 invoices and we get only 2 ids
    const invoices = [
      { title: 'Facture 3', amount: 1000 },
      { title: 'Facture 4', amount: 2000 },
      { title: 'Facture 5', amount: 3000 },
    ]
    const ids = []
    for (let i = 0; i < invoices.length; i++) {
      const row = await db.invoice.create({ data: invoices[i] })
      if (i < invoices.length - 1) ids.push(row.id)
    }

    // WHEN
    // I make a GET request on table invoices
    const rows = await request
      .get(
        `/api/table/invoices?filter_key_0=id&filter_operator_0=is_any_of&filter_value_0=${ids.join(
          ','
        )}`
      )
      .then((res) => res.json())

    // THEN
    // I have read 2 invoices
    expect(rows.length).toEqual(2)
    expect(rows[0].title).toEqual(invoices[0].title)
    expect(rows[1].title).toEqual(invoices[1].title)
  })

  test('should update a row', async ({ request, db }) => {
    // GIVEN
    // We provide an invoice
    const invoice = { title: 'Facture 5', amount: 1000 }
    const row = await db.invoice.create({ data: invoice })

    // WHEN
    // I make a PATCH request to update this invoice
    await request.patch(`/api/table/invoices/${row.id}`, { data: { title: 'Facture 6' } })

    // THEN
    // The updated invocie should have a new name
    const updatedRow = await db.invoice.findUniqueOrThrow({ where: { id: row.id } })
    expect(updatedRow.id).toEqual(row.id)
    expect(updatedRow.title).toEqual('Facture 6')
  })

  test('should soft delete a row', async ({ request, db }) => {
    // GIVEN
    // We provide an invoice
    const invoice = { title: 'Facture 7', amount: 1000 }
    const row = await db.invoice.create({ data: invoice })

    // WHEN
    // I make a DELETE request to soft delete this invoice
    await request.delete(`/api/table/invoices/${row.id}`)

    // THEN
    // I should have a deleted_at value on my soft deleted invoice
    const deletedRow = await db.invoice.findUniqueOrThrow({ where: { id: row.id } })
    expect(deletedRow.id).toEqual(row.id)
    expect(deletedRow.deleted_at).toBeDefined()
  })
})
