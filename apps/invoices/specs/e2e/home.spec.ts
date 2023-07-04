import { test, expect } from './fixtures'

test.describe('A page that list invoices', () => {
  test('should display a title', async ({ page }) => {
    // WHEN
    // I go to the home page "/"
    await page.goto('/')

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })

  test('should display a list of invoices grouped by status', async ({ page, db, faker }) => {
    // GIVEN
    // We provide 8 example invoices
    await db.invoice.deleteMany({})
    const invoices = faker.generate('invoices', 8)
    for (const data of invoices) await db.invoice.create({ data })

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto('/')
    await page.waitForSelector('text=/^Statut$/')

    // THEN
    // Check that invoices are displayed in a group by status
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

  test('should display a list of invoices sorted by dates in status groups', async ({
    page,
    db,
    faker,
  }) => {
    // GIVEN
    // We provide 5 example invoices with finalised dates and status
    const invoices = faker.generate('invoices', [
      {
        finalised_date: new Date(2021, 3, 15).toISOString(),
        status: 'finalised',
      },
      {
        finalised_date: new Date(2021, 4, 25).toISOString(),
        status: 'paid',
      },
      {
        finalised_date: new Date(2021, 4, 6).toISOString(),
        status: 'finalised',
      },
      {
        finalised_date: new Date(2021, 5, 4).toISOString(),
        status: 'sent',
      },
      {
        finalised_date: new Date(2021, 4, 20).toISOString(),
        status: 'sent',
      },
    ])
    await db.invoice.deleteMany({})
    for (let i = 0; i < invoices.length; i++)
      invoices[i] = await db.invoice.create({ data: invoices[i] })

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto('/')
    await page.waitForSelector('text=/^Date de finalisation$/')

    // THEN
    // Check that factures are sorted by finalised_date
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

  test('should go to the /create page when clicking on the "Créer une facture" button', async ({
    page,
  }) => {
    // WHEN
    // I go to the home page "/"
    await page.goto('/')

    // AND
    // I click on the "Créer une facture" button
    await page.click('text="Créer une facture"')
    await page.waitForURL('/create')

    // THEN
    // Check that I'm on the /create page
    expect(await page.textContent('h1')).toContain('Créer une facture')
  })
})
