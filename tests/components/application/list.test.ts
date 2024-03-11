import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig, ConfigError } from '@solumy/engine'
import Database from '@utils/tests/database'

test.describe('List component', () => {
  test('should return an error config if source is not valid table endpoint', async () => {
    // GIVEN
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
                  component: 'List',
                  source: '/api/table/leads',
                  columns: [
                    {
                      name: 'name',
                    },
                  ],
                  open: '/{{name}}',
                },
              ],
            },
          ],
        },
      ],
    }
    const app = new App()

    // WHEN
    const errors = await app.getConfigErrors(config)

    // THEN
    expect(errors).toContainEqual(
      new ConfigError({
        message: 'Table source /api/table/leads does not have a GET handler',
      })
    )
  })

  test.skip('should display a row in a list', async ({ page }) => {
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
                  component: 'List',
                  source: '/api/table/leads',
                  columns: [
                    {
                      name: 'name',
                    },
                  ],
                  open: '/{{name}}',
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
    await expect(page.getByText('John')).toBeVisible()
  })

  test.skip('should open a row page', async ({ page }) => {
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
                  component: 'List',
                  source: '/api/table/leads',
                  columns: [
                    {
                      name: 'name',
                    },
                  ],
                  open: '/request/{{id}}',
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
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('text=John')

    // THEN
    await expect(page.waitForURL('**/request/1')).resolves.toBeUndefined()
  })

  test.skip('should display a new row in realtime', async ({ page }) => {
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
                  component: 'List',
                  source: '/api/table/leads',
                  columns: [
                    {
                      name: 'name',
                    },
                  ],
                  open: '/{{name}}',
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
    await page.getByText('John').waitFor({ state: 'visible' })
    await database.table('leads').insert({ id: '2', name: 'Doe', created_at: new Date() })

    // THEN
    await expect(page.getByText('Doe')).toBeVisible()
  })
})
