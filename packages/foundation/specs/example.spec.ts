import { test, expect } from './fixtures'

test.describe('Tests Example', () => {
  test('A page can display a text', async ({ page, foundation }) => {
    // GIVEN
    await foundation.start({
      pages: [
        {
          path: '/',
          components: [
            {
              type: 'paragraph',
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

  test('A table can store a record', async ({ request, foundation }) => {
    // GIVEN
    const db = await foundation.start({
      tables: [
        {
          name: 'invoices',
          fields: [
            {
              name: 'customer',
              type: 'single_line_text',
            },
          ],
        },
      ],
    })

    // WHEN
    const res = await request.post('/api/table/invoices', {
      data: {
        customer: 'Essentiel',
      },
    })

    // THEN
    expect(res.status()).toEqual(200)
    const [row] = await db.list('invoices')
    expect(row.id).toBeDefined()
    expect(row.customer).toBe('Essentiel')
  })
})
