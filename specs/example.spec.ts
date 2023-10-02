import { ConfigDto } from '@adapters/dtos/ConfigDto'
import { test, expect, helpers } from '../test/e2e/fixtures'

test.describe('Specs examples', () => {
  test('should display a text', async ({ page }) => {
    // GIVEN
    const config: ConfigDto = {
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
    const app = await helpers.startApp(config)

    // WHEN
    await page.goto(helpers.getUrl(app.port, '/'))

    // THEN
    await expect(page.getByText('Hello World!')).toBeVisible()
  })

  test('should store a record', async ({ request }) => {
    // GIVEN
    const config: ConfigDto = {
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
    const app = await helpers.startApp(config)

    // WHEN
    const res = await request.post(helpers.getUrl(app.port, '/api/table/invoices'), {
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
