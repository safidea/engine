import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'
import Database from '@tests/database'

test.describe('Table component', () => {
  test('should return an error config if source is not valid table endpoint', async () => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
    }
    const app = new App()

    // WHEN
    const call = () => app.start(config)

    // THEN
    await expect(call()).rejects.toThrow(
      'Table source /api/table/leads does not have a GET handler'
    )
  })

  Database.each(test, (dbConfig) => {
    test('should display a row in a table', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
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
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
      }
      const app = new App()
      const url = await app.start(config)
      await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

      // WHEN
      await page.goto(url)

      // THEN
      await expect(page.getByText('John')).toBeVisible()
    })

    test('should display a new row in realtime', async ({ page }) => {
      // GIVEN
      const database = new Database(dbConfig)
      const config: Config = {
        name: 'App',
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
                field: 'SingleLineText',
              },
            ],
          },
        ],
        database: dbConfig,
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

  test('should open an add row page', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('text=Add row')

    // THEN
    await expect(page.waitForURL('**/add')).resolves.toBeUndefined()
  })

  test('should display a title for a table', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.locator('text=Leads')).toBeVisible()
  })

  test('should display the table id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Table',
              id: 'my-table',
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)

    // THEN
    const table = page.locator('#my-table')
    await expect(table).toBeVisible()
  })
})
