import { test, expect } from '@tests/fixtures'
import App, { type App as AppConfig } from '@safidea/engine'
import Page, { type Component, type Page as PageConfig } from '@safidea/engine/page'
import Database from '@tests/database'

test.describe('Sidebar component', () => {
  test('should display a title', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
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
    await expect(page.locator('[data-component="Title"]')).toBeVisible()
  })

  test('should display a list of links with icons', async ({ page }) => {
    // GIVEN
    const config: AppConfig = {
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
  })

  test('should display a paragraph when clicking on a link', async ({ page }) => {
    // GIVEN
    const sidebar = (children: Component[]): Component => ({
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
    const config: AppConfig = {
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
  })

  test('should display a table with a row', async ({ page }) => {
    // GIVEN
    const database = new Database()
    const config: AppConfig = {
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

  test('should display the sidebar id', async ({ page }) => {
    // GIVEN
    const config: PageConfig = {
      name: 'Page',
      path: '/',
      body: [
        {
          component: 'Sidebar',
          id: 'my-sidebar',
          title: { text: 'Menu' },
          links: [],
        },
      ],
    }

    // WHEN
    const pageEngine = new Page()
    const html = await pageEngine.getHtml(config)
    await page.setContent(html)

    // THEN
    const sidebar = page.locator('#my-sidebar')
    await expect(sidebar).toBeVisible()
  })
})
