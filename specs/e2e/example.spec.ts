import { AppDto } from '@adapters/dtos/AppDto'
import { test, expect, helpers, Engine } from '../utils/e2e/fixtures'

test.describe('Specs examples', () => {
  test('should display a text', async ({ page, folder }) => {
    // GIVEN
    const port = 50601
    const config: AppDto = {
      pages: [
        {
          path: '/',
          title: 'Home',
          components: [
            {
              type: 'paragraph',
              text: 'Hello World!',
            },
          ],
        },
      ],
    }
    await new Engine({ port, folder }).start(config)

    // WHEN
    await page.goto(helpers.getUrl(port, '/'))

    // THEN
    await expect(page.getByText('Hello World!')).toBeVisible()
  })

  test('should store a record', async ({ request, folder }) => {
    // GIVEN
    const port = 50602
    const config: AppDto = {
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
    }
    const app = await new Engine({ port, folder }).start(config)

    // WHEN
    const res = await request.post(helpers.getUrl(port, '/api/table/invoices'), {
      data: {
        customer: 'Essentiel',
      },
    })

    // THEN
    expect(res.status()).toEqual(200)
    const [record] = await app.drivers.database.list('invoices')
    expect(record.id).toBeDefined()
    expect(record.customer).toBe('Essentiel')
  })
})
