import { test, expect, Foundation } from '../utils/e2e/fixtures'

test.describe('Specs examples', () => {
  test('A page can display a text', async ({ page, url, orm, folder }) => {
    // GIVEN
    const port = 50601
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
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
      .start()

    // WHEN
    await page.goto(url(port, '/'))

    // THEN
    await expect(page.getByText('Hello World!')).toBeVisible()
  })

  test('A table can store a record', async ({ request, url, orm, folder }) => {
    // GIVEN
    const port = 50602
    await new Foundation({ port, folder, adapters: { orm } })
      .config({
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
      .start()

    // WHEN
    const res = await request.post(url(port, '/api/table/invoices'), {
      data: {
        customer: 'Essentiel',
      },
    })

    // THEN
    expect(res.status()).toEqual(200)
    const [record] = await orm.list('invoices')
    expect(record.id).toBeDefined()
    expect(record.customer).toBe('Essentiel')
  })
})
