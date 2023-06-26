import { test, expect } from '@playwright/test'
import orm from '../app/orm'

test.describe('A page that list factures', () => {
  test('should display a title', async ({ page }) => {
    // WHEN
    // I go to the home page "/"
    await page.goto('/')

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })

  test('should display a list of factures grouped by status and sorted by dates', async ({
    page,
  }) => {
    // GIVEN
    // We provide 8 example factures
    const factures = [
      { title: 'Facture 1', amount: 100, status: 'draft' },
      {
        title: 'Facture 2',
        amount: 200,
        finalised_date: new Date(2021, 6, 4).toISOString(),
        status: 'finalised',
        number: '1002',
      },
      {
        title: 'Facture 3',
        amount: 300,
        finalised_date: new Date(2021, 6, 5).toISOString(),
        status: 'sent',
        number: '1003',
      },
      {
        title: 'Facture 4',
        amount: 400,
        finalised_date: new Date(2021, 5, 4).toISOString(),
        status: 'finalised',
        number: '1004',
      },
      { title: 'Facture 5', amount: 500, status: 'draft' },
      {
        title: 'Facture 6',
        amount: 600,
        finalised_date: new Date(2021, 4, 6).toISOString(),
        status: 'paid',
        number: '1006',
      },
      { title: 'Facture 7', amount: 700, status: 'draft' },
      {
        title: 'Facture 8',
        amount: 800,
        finalised_date: new Date(2021, 4, 8).toISOString(),
        status: 'sent',
        number: '1008',
      },
    ]
    await orm.invoice.deleteMany({})
    for (const data of factures) await orm.invoice.create({ data })

    // WHEN
    // I go to the home page "/" and invoices are loaded
    await page.goto('/')
    await page.waitForSelector('text=/^Brouillon$/')

    // THEN
    // Check that factures are displayed in a group by status
    const draftRows = await page.$$('text=/^Brouillon$/')
    expect(draftRows.length).toBe(4)

    // Check the number of finalised rows
    const finalisedRows = await page.$$('text=/^Finalisée$/')
    expect(finalisedRows.length).toBe(3)

    // Check the number of sent rows
    const sentRows = await page.$$('text=/^Envoyée$/')
    expect(sentRows.length).toBe(3)

    // Check the number of paid rows
    const paidRows = await page.$$('text=/^Payée$/')
    expect(paidRows.length).toBe(2)

    // Check that factures are sorted by finalised_date
    const rows = await page.$$('text=/Facture \\d/')
    expect(await rows[0].innerText()).toBe('Facture 1')
    expect(await rows[1].innerText()).toBe('Facture 5')
    expect(await rows[2].innerText()).toBe('Facture 7')
    expect(await rows[3].innerText()).toBe('Facture 2')
    expect(await rows[4].innerText()).toBe('Facture 4')
    expect(await rows[5].innerText()).toBe('Facture 3')
    expect(await rows[6].innerText()).toBe('Facture 8')
    expect(await rows[7].innerText()).toBe('Facture 6')
  })
})
