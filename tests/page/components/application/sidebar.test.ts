import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'
import Database from '@utils/tests/database'

test.describe('Sidebar component', () => {
  test('should display a title', async ({ page }) => {
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
                  component: 'Sidebar',
                  title: 'Menu',
                  links: [],
                  children: [],
                },
              ],
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
    const titleContent = await page.textContent('h4')
    expect(titleContent).toContain('Menu')
  })

  test('should display a list of links with icons', async ({ page }) => {
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
                  component: 'Sidebar',
                  title: 'Menu',
                  links: [
                    {
                      label: 'Home',
                      beforeIcon: 'Home',
                      href: '/',
                    },
                    {
                      label: 'Leads',
                      beforeIcon: 'Users',
                      href: '/leads',
                    },
                  ],
                  children: [],
                },
              ],
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
                  block: 'Sidebar',
                  children: [
                    {
                      component: 'Paragraph',
                      text: 'Home page',
                    },
                  ],
                },
              ],
            },
            {
              name: 'Leads',
              path: '/leads',
              body: [
                {
                  block: 'Sidebar',
                  children: [
                    {
                      component: 'Paragraph',
                      text: 'Leads page',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      blocks: [
        {
          name: 'Sidebar',
          component: 'Sidebar',
          title: 'Menu',
          links: [
            {
              label: 'Home',
              beforeIcon: 'Home',
              href: '/',
            },
            {
              label: 'Leads',
              beforeIcon: 'Users',
              href: '/leads',
            },
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
    const paragraphContent = await page.textContent('p')
    expect(paragraphContent).toContain('Leads page')
  })

  test('should display a table with a row', async ({ page }) => {
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
                  component: 'Sidebar',
                  title: 'Menu',
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
})
