import { test, expect } from '@playwright/test'
import App, { type Config as AppConfig } from '@solumy/engine'

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
    const titleContent = await page.textContent('h2')
    expect(titleContent).toContain('Menu')
  })

  test.skip('should display a list of links with icons', async ({ page }) => {
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
                      beforeIcon: 'home',
                      href: '/',
                    },
                    {
                      label: 'Leads',
                      beforeIcon: 'leads',
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

  test.skip('should display a paragraph when clicking on a link', async ({ page }) => {
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
                  sharedComponent: 'Sidebar',
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
                  sharedComponent: 'Sidebar',
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
      shared: {
        components: [
          {
            name: 'Sidebar',
            component: 'Sidebar',
            title: 'Menu',
            links: [
              {
                label: 'Home',
                beforeIcon: 'home',
                href: '/',
              },
              {
                label: 'Leads',
                beforeIcon: 'leads',
                href: '/leads',
              },
            ],
            children: [],
          },
        ],
      },
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
})
