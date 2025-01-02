import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
// import Database from '@test/drivers/database'

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
  }
  const app = new NodeApp()

  // WHEN
  const call = () => app.start(config)

  // THEN
  await expect(call()).rejects.toThrow('Table source /api/table/leads does not have a GET handler')
})

/*

Database.each(test, (dbConfig) => {
  test('should display a row in a list', async ({ page }) => {
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // WHEN
    await page.goto(url)

    // THEN
    await expect(page.getByText('John')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should open a row page', async ({ page }) => {
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
              component: 'List',
              source: '/api/table/leads',
              columns: [
                {
                  name: 'name',
                },
              ],
              open: '/request/{{ row.id }}',
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
    const app = new NodeApp()
    const { url } = await app.start(config)
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // WHEN
    await page.goto(url)
    await page.click('text=John')

    // THEN
    await expect(page.waitForURL('**\/request/1')).resolves.toBeUndefined()
    expect(await page.screenshot()).toMatchSnapshot()
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // WHEN
    await page.goto(url)
    await page.getByText('John').waitFor({ state: 'visible' })
    await database.table('leads').insert({ id: '2', name: 'Doe', created_at: new Date() })

    // THEN
    await expect(page.getByText('Doe')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should display the list with id', async ({ page }) => {
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
              component: 'List',
              id: 'my-list',
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
              field: 'SingleLineText',
            },
          ],
        },
      ],
      database: dbConfig,
    }
    const app = new NodeApp()
    const { url } = await app.start(config)
    await database.table('leads').insert({ id: '1', name: 'John', created_at: new Date() })

    // WHEN
    await page.goto(url)
    await page.getByText('John').waitFor({ state: 'visible' })

    // THEN
    const list = page.locator('#my-list')
    await expect(list).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })
})

*/
