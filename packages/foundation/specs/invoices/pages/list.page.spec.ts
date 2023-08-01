import { test, expect, helpers } from '../../utils/fixtures'

test.describe('A page that list invoices', () => {
  test('should display a title', async ({ page, foundation }) => {
    // GIVEN
    await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_list'),
    })

    // WHEN
    // I go to the home page "/"
    await page.goto('/list')

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })

  test('should display a list of invoices grouped by status', async ({ page, foundation }) => {
    // GIVEN
    // We provide 8 example invoices
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_list'),
    })
    await db.createManyRecords('invoices', [
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
    await page.goto('/list')
    await page.waitForSelector('text=/^Statut$/')

    // THEN
    // Check that invoices are displayed in a group by status
    const invoices = await db.list('invoices')

    // Check the number of draft rows
    const draftRows = await page.$$('text=/^Brouillon$/')
    expect(draftRows.length).toBe(invoices.filter((i) => i.status === 'draft').length + 1)

    // Check the number of finalised rows
    const finalisedRows = await page.$$('text=/^Finalisée$/')
    expect(finalisedRows.length).toBe(invoices.filter((i) => i.status === 'finalised').length + 1)

    // Check the number of sent rows
    const sentRows = await page.$$('text=/^Envoyée$/')
    expect(sentRows.length).toBe(invoices.filter((i) => i.status === 'sent').length + 1)

    // Check the number of paid rows
    const paidRows = await page.$$('text=/^Payée$/')
    expect(paidRows.length).toBe(invoices.filter((i) => i.status === 'paid').length + 1)
  })

  test.skip('should display a list of invoices sorted by dates in status groups', async ({
    page,
    foundation,
  }) => {
    // GIVEN
    // We provide 5 example invoices with finalised dates and status
    const db = await foundation.start({
      tables: helpers.getTables('invoices'),
      pages: helpers.getPages('invoices_list'),
    })
    await db.createManyRecords('invoices', [
      {
        finalised_time: new Date(2021, 4, 6).toISOString(),
        status: 'finalised',
      },
      {
        finalised_time: new Date(2021, 4, 25).toISOString(),
        status: 'paid',
      },
      {
        finalised_time: new Date(2021, 3, 15).toISOString(),
        status: 'finalised',
      },
      {
        finalised_time: new Date(2021, 5, 4).toISOString(),
        status: 'sent',
      },
      {
        finalised_time: new Date(2021, 4, 20).toISOString(),
        status: 'sent',
      },
    ])

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto('/list')
    await page.waitForSelector('text=/^Date de finalisation$/')

    // THEN
    // Check that factures are sorted by finalised_date
    const invoices = await db.list('invoices')
    const rows = await page.$$('tr[id]')
    const ids = await Promise.all(rows.map((row) => row.getAttribute('id')))
    expect(ids).toEqual([
      invoices[2].id,
      invoices[0].id,
      invoices[3].id,
      invoices[4].id,
      invoices[1].id,
    ])
  })

  test.skip('should go to the /create page when clicking on the "Créer une facture" button', async ({
    page,
    foundation,
  }) => {
    // GIVEN
    await foundation.start({
      pages: helpers.getPages('invoices_list', 'invoices_create'),
    })

    // WHEN
    // I go to the home page "/"
    await page.goto('/list')

    // AND
    // I click on the "Créer une facture" button
    await page.click('text="Créer une facture"')
    await page.waitForURL('/create')

    // THEN
    // Check that I'm on the /create page
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })
})
