import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'
import Database from '@utils/tests/database'

test.describe('Table component', () => {
  test('should display a row in a table', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const config: AppConfig = {
      name: 'App',
      features: [
        {
          name: 'Feature',
          pages: [
            {
              name: 'Page',
              path: '/',
              body: [
                {
                  component: 'Table',
                  source: '/api/table/leads',
                  columns: [
                    {
                      name: 'name',
                      label: 'Name',
                    },
                  ],
                },
              ],
            },
          ],
          tables: [
            {
              name: 'leads',
              fields: [
                {
                  name: 'name',
                  type: 'SingleLineText',
                },
              ],
            },
          ],
        },
      ],
      database: database.config,
    }
    const app = new App()
    const url = await app.start(config)
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('text=John')).toBeVisible()
  })
})
