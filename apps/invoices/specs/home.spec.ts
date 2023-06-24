import { test, expect } from '@playwright/test'

test.describe('A page that list invoices', () => {
  test('should display a title', async ({ page }) => {
    // WHEN
    // I go to the home page "/"
    await page.goto('/')

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('Toutes les factures')
  })

  /*test('should display a list of invoices grouped by status and sorted by dates', async ({
    page,
    request,
  }) => {
    // We provide 8 example invoices
    const invoices: DatabaseDataType[] = [
      { title: 'Invoice 1', amount: 100, status: 'draft' },
      {
        title: 'Invoice 2',
        amount: 200,
        finalised_date: '2021-06-04',
        status: 'finalised',
        number: '1002',
      },
      {
        title: 'Invoice 3',
        amount: 300,
        finalised_date: '2021-06-05',
        status: 'sent',
        number: '1003',
      },
      {
        title: 'Invoice 4',
        amount: 400,
        finalised_date: '2021-05-04',
        status: 'finalised',
        number: '1004',
      },
      { title: 'Invoice 5', amount: 500, status: 'draft' },
      {
        title: 'Invoice 6',
        amount: 600,
        finalised_date: '2021-04-06',
        status: 'paid',
        number: '1006',
      },
      { title: 'Invoice 7', amount: 700, status: 'draft' },
      {
        title: 'Invoice 8',
        amount: 800,
        finalised_date: '2021-04-08',
        status: 'sent',
        number: '1008',
      },
    ]
    // TODO: use the DatabaseProvider to seed the database
    await request.post('/api/table/invoices', { data: invoices })
    // await app.seed('invoices', invoices)

    // WHEN
    // I go to the home page "/"
    await page.goto('/')

    // THEN
    // Check that I'm on the / page
    expect(await page.textContent('h1')).toContain('All invoices')

    //expect(screen.getByRole('heading', { name: /All invoices/i })).toBeInTheDocument()

    // THEN
    // Check that invoices are displayed in a group by status
    /*const draftRows = screen.getAllByText(/^Draft$/)
    expect(draftRows).toHaveLength(4)

    const finalisedRows = screen.getAllByText(/^Finalised$/)
    expect(finalisedRows).toHaveLength(3)

    const sentRows = screen.getAllByText(/^Sent$/)
    expect(sentRows).toHaveLength(3)

    const paidRows = screen.getAllByText(/^Paid$/)
    expect(paidRows).toHaveLength(2)

    // THEN
    // Check that invoices are sorted by finalised_date
    const rows = screen.getAllByText(/Invoice \d/)
    expect(rows[0]).toHaveTextContent('Invoice 1')
    expect(rows[1]).toHaveTextContent('Invoice 5')
    expect(rows[2]).toHaveTextContent('Invoice 7')
    expect(rows[3]).toHaveTextContent('Invoice 2')
    expect(rows[4]).toHaveTextContent('Invoice 4')
    expect(rows[5]).toHaveTextContent('Invoice 3')
    expect(rows[6]).toHaveTextContent('Invoice 8')
    expect(rows[7]).toHaveTextContent('Invoice 6')
  })*/
})