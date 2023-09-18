import { test, expect, helpers, Engine } from '../utils/e2e/fixtures'

test.describe('Specs examples', () => {
  test('should display a text', async ({ page, orm, folder }) => {
    // GIVEN
    const port = 50601
    await new Engine({ port, folder, orm })
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
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.getByText('Hello World!')).toBeVisible()
  })

  test('should store a record', async ({ request, orm, folder }) => {
    // GIVEN
    const port = 50602
    await new Engine({ port, folder, orm })
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
    const res = await request.post(helpers.getUrl(port, '/api/table/invoices'), {
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
