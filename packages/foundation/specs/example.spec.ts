import { test, expect } from './fixtures'

test.describe('Tests Example', () => {
  test('A page can display the a text', async ({ page, app }) => {
    // GIVEN
    await app.start({
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

  test('A table can store a record', async ({ request, app }) => {
    // GIVEN
    const db = await app.start({
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
})
