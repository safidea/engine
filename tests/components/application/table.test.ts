import { test, expect } from '@tests/fixtures'
import App, { type Config as AppConfig, ConfigError } from '@solumy/engine'
import Database from '@tests/database'

test.describe('Table component', () => {
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
    await expect(page.getByText('John')).toBeVisible()
  })

  test('should open an add row page', async ({ page }) => {
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
                  buttons: [
                    {
                      label: 'Add row',
                      href: '/add',
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

    // WHEN
    await page.goto(url)
    await page.click('text=Add row')

    // THEN
    await expect(page.waitForURL('**/add')).resolves.toBeUndefined()
  })

  test('should display a new row in realtime', async ({ page }) => {
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
                  buttons: [
                    {
                      label: 'Add row',
                      href: '/add',
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
    await page.getByText('John').waitFor({ state: 'visible' })
    await database.table('leads').insert({ id: '2', name: 'Doe', created_at: new Date() })

    // THEN
    await expect(page.getByText('Doe')).toBeVisible()
  })

  test('should display a title for a table', async ({ page }) => {
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
                  title: { text: 'Leads' },
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

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('text=Leads')).toBeVisible()
  })
})
