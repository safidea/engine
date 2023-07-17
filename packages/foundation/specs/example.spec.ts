import { test, expect } from './fixtures'

test('Page has text hello word', async ({ page, startApp }) => {
  // GIVEN
  await startApp({
    pages: [
      {
        path: '/',
        components: [
          {
            key: 'div',
            text: 'Hello World!',
          },
        ],
      },
    ],
  })

  // WHEN
  await page.goto('/')

  // THEN
  await expect(page.getByText('Hello World!')).toBeVisible()
})

test.skip('Route response message hello world', async ({ request, startApp }) => {
  // GIVEN
  const db = await startApp({
    tables: [
      {
        name: 'invoices',
        fields: [
          {
            name: 'customer',
            type: 'text',
          },
        ],
      },
    ],
  })

  // WHEN
  await request.post('/api/table/invoices', {
    data: {
      customer: 'Essentiel',
    },
  })

  // THEN
  const [row] = await db.list('invoices')
  expect(row.customer).toBe('Essentiel')
})
