import { test, expect } from '@tests/fixtures'
import App, { type Config } from '@latechforce/engine'
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
              table: 'leads',
              fields: [
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
    await expect(call()).rejects.toThrow('Table "leads" not found')
  })

  Database.SQLite(test, (dbConfig) => {
    test('should display a row with style in a table', async ({ page }) => {
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
                table: 'leads',
                fields: [
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
      const classExistsInCSS = await page.evaluate((className) => {
        const stylesheets = Array.from(document.styleSheets)
        for (const stylesheet of stylesheets) {
          const rules = stylesheet.cssRules || []
          for (const rule of rules)
            if (rule instanceof CSSStyleRule && rule.selectorText.includes(`.${className}`))
              return true
        }
        return false
      }, 'border-b')

      // THEN
      expect(classExistsInCSS).toBeTruthy()
      expect(await page.screenshot()).toMatchSnapshot()
    })

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
                table: 'leads',
                fields: [
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
                component: 'Table',
                table: 'leads',
                fields: [
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
      await page.getByText('John').waitFor({ state: 'visible' })
      await database.table('leads').insert({ id: '2', name: 'Doe', created_at: new Date() })

      // THEN
      await expect(page.getByText('Doe')).toBeVisible()
      expect(await page.screenshot()).toMatchSnapshot()
    })
  })
})
