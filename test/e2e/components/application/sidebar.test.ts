import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'
import Database from '@test/drivers/database'
import type { IComponent } from '@adapter/api/configs/Component'

test.describe('Sidebar component', () => {
  test('should display a sidebar with id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Sidebar',
              id: 'sidebar',
              title: { text: 'Menu' },
              links: [],
              children: [],
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
    const sidebar = await page.$('#sidebar')
    expect(sidebar).not.toBeNull()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should display a list of links with icons', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Sidebar',
              title: { text: 'Menu' },
              links: [
                {
                  label: 'Home',
                  prefixIcon: { name: 'Home' },
                  href: '/',
                },
                {
                  label: 'Leads',
                  prefixIcon: { name: 'Users' },
                  href: '/leads',
                },
              ],
              children: [],
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
    const homeLink = await page.textContent('a[href="/"]')
    expect(homeLink).toContain('Home')

    const leadsLink = await page.textContent('a[href="/leads"]')
    expect(leadsLink).toContain('Leads')

    expect(await page.screenshot()).toMatchSnapshot()
  })

  test('should display a paragraph when clicking on a link', async ({ page }) => {
    // GIVEN
    const sidebar = (children: IComponent[]): IComponent => ({
      component: 'Sidebar',
      title: { text: 'Menu' },
      links: [
        {
          label: 'Home',
          prefixIcon: { name: 'Home' },
          href: '/',
        },
        {
          label: 'Leads',
          prefixIcon: { name: 'Users' },
          href: '/leads',
        },
      ],
      children,
    })
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            sidebar([
              {
                component: 'Paragraph',
                text: 'Home page',
              },
            ]),
          ],
        },
        {
          name: 'Leads',
          path: '/leads',
          body: [
            sidebar([
              {
                component: 'Paragraph',
                text: 'Leads page',
              },
            ]),
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('a[href="/leads"]')

    // THEN
    await expect(page.getByText('Leads page')).toBeVisible()
    expect(await page.screenshot()).toMatchSnapshot()
  })

  Database.each(test, (dbConfig) => {
    test('should display a table with a row', async ({ page }) => {
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
                component: 'Sidebar',
                title: { text: 'Menu' },
                links: [],
                children: [
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
  })
})
