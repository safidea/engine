import { test, expect, helpers, Foundation } from '../../../utils/e2e/fixtures'

test.describe('A page that list invoices', () => {
  test('should display a title', async ({ page, url, folder }) => {
    // GIVEN
    const port = 50301
    await new Foundation({ folder, port })
      .config({
        tables: helpers.getTablesDto('invoices'),
        pages: helpers.getPagesDto('invoices_list'),
      })
      .start()

    // WHEN
    // I go to the home page "/"
    await page.goto(url(port, '/list'))

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })

  test('should display a list of invoices grouped by status', async ({
    page,
    url,
    orm,
    folder,
  }) => {
    // GIVEN
    // We provide 8 example invoices
    const port = 50302
    await new Foundation({ folder, port, adapters: { orm } })
      .config({
        tables: helpers.getTablesDto('invoices'),
        pages: helpers.getPagesDto('invoices_list'),
      })
      .start()
    const {
      invoices: [firstInvoice],
    } = await helpers.generateRecords(orm, 'invoices', [
      {
        status: 'draft',
      },
      {
        status: 'draft',
      },
      {
        status: 'finalised',
      },
      {
        status: 'finalised',
      },
      {
        status: 'sent',
      },
      {
        status: 'sent',
      },
      {
        status: 'sent',
      },
      {
        status: 'paid',
      },
    ])

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto(url(port, '/list'))
    await page.getByRole('cell', { name: String(firstInvoice.customer) }).waitFor()

    // THEN
    // Check that invoices are displayed in a group by status
    const invoices = await orm.list('invoices')

    // Check the number of draft rows
    const draftRows = await page.getByRole('cell', { name: /^Brouillon$/ }).all()
    expect(draftRows.length).toBe(invoices.filter((i) => i.status === 'draft').length + 1)

    // Check the number of finalised rows
    const finalisedRows = await page.getByRole('cell', { name: /^Finalisée$/ }).all()
    expect(finalisedRows.length).toBe(invoices.filter((i) => i.status === 'finalised').length + 1)

    // Check the number of sent rows
    const sentRows = await page.getByRole('cell', { name: /^Envoyée$/ }).all()
    expect(sentRows.length).toBe(invoices.filter((i) => i.status === 'sent').length + 1)

    // Check the number of paid rows
    const paidRows = await page.getByRole('cell', { name: /^Payée$/ }).all()
    expect(paidRows.length).toBe(invoices.filter((i) => i.status === 'paid').length + 1)
  })

  test('should display a list of invoices sorted by dates in status groups', async ({
    page,
    url,
    folder,
    orm,
  }) => {
    // GIVEN
    // We provide 5 example invoices with finalised dates and status
    const port = 50303
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
        tables: helpers.getTablesDto('invoices'),
        pages: helpers.getPagesDto('invoices_list'),
      })
      .start()
    const {
      invoices: [firstInvoice],
    } = await helpers.generateRecords(orm, 'invoices', [
      {
        finalised_time: new Date(2021, 3, 15).toISOString(),
        status: 'finalised',
      },
      {
        finalised_time: new Date(2021, 4, 25).toISOString(),
        status: 'paid',
      },
      {
        finalised_time: new Date(2021, 5, 4).toISOString(),
        status: 'sent',
      },
      {
        finalised_time: new Date(2021, 4, 6).toISOString(),
        status: 'finalised',
      },
      {
        finalised_time: new Date(2021, 4, 20).toISOString(),
        status: 'sent',
      },
    ])

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto(url(port, '/list'))
    await page.getByRole('cell', { name: String(firstInvoice.customer) }).waitFor()

    // THEN
    // Check that factures are sorted by finalised_date
    const invoices = await orm.list('invoices')
    const rows = await page.getByRole('row').all()
    const ids = await Promise.all(rows.map((row) => row.getAttribute('id')))
    expect(ids.filter((i) => !!i)).toEqual([
      invoices[3].id,
      invoices[0].id,
      invoices[2].id,
      invoices[4].id,
      invoices[1].id,
    ])
  })

  test('should go to the /create page when clicking on the "Créer une facture" button', async ({
    page,
    folder,
    url,
  }) => {
    // GIVEN
    const port = 50304
    await new Foundation({ port, folder })
      .config({
        tables: helpers.getTablesDto('invoices'),
        pages: helpers.getPagesDto('invoices_list', 'invoices_create'),
      })
      .start()

    // WHEN
    // I go to the home page "/"
    await page.goto(url(port, '/list'))

    // AND
    // I click on the "Créer une facture" button
    await page.click('text="Créer une facture"')
    await page.waitForURL('/create')

    // THEN
    // Check that I'm on the /create page
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })

  test('should display an invoice with calculated vat and total', async ({
    page,
    url,
    orm,
    folder,
  }) => {
    // GIVEN
    const port = 50305
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
        tables: helpers.getTablesDto('invoices'),
        pages: helpers.getPagesDto('invoices_list'),
      })
      .start()
    const {
      invoices: [invoice],
    } = await helpers.generateRecords(orm, 'invoices', [
      {
        status: 'draft',
        items: [
          {
            quantity: 3,
            unit_price: 15,
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

    // WHEN
    await page.goto(url(port, '/list'))
    await expect(page.getByRole('cell', { name: String(invoice.customer) })).toBeVisible()

    // THEN
    await expect(page.getByRole('cell', { name: /^65€$/i })).toBeVisible()
    await expect(page.getByRole('cell', { name: /^13€$/i })).toBeVisible()
    await expect(page.getByRole('cell', { name: /^78€$/i })).toBeVisible()
  })
})
