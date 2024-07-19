import { test, expect } from '@tests/fixtures'
import App, { type App as Config } from '@safidea/engine'

test.describe('Hero component', () => {
  test('should render a hero', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: '/',
    }
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Hero',
              title: { text: title },
              paragraph: { text: description },
              buttons: [primaryButton],
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
    const titleContent = await page.textContent('h1')
    expect(titleContent).toContain(title)

    const descriptionContent = await page.textContent('p')
    expect(descriptionContent).toContain(description)

    const buttonContent = await page.textContent('a')
    expect(buttonContent).toContain(primaryButton.label)
  })

  test('should redirect when clicking on primary button', async ({ page }) => {
    // GIVEN
    const title = 'This is a title'
    const description = 'This is a description'
    const primaryButton = {
      label: 'Click me',
      href: 'https://example.com/',
    }
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Hero',
              title: { text: title },
              paragraph: { text: description },
              buttons: [primaryButton],
            },
          ],
        },
      ],
    }
    const app = new App()
    const url = await app.start(config)

    // WHEN
    await page.goto(url)
    await page.click('a')

    // THEN
    expect(page.url()).toBe(primaryButton.href)
  })

  test('should display the hero id', async ({ page }) => {
    // GIVEN
    const config: Config = {
      name: 'App',
      pages: [
        {
          name: 'Page',
          path: '/',
          body: [
            {
              component: 'Hero',
              id: 'my-hero',
              title: { text: 'This is a title' },
              paragraph: { text: 'This is a description' },
              buttons: [
                {
                  label: 'Click me',
                  href: '/',
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
    const hero = page.locator('#my-hero')
    await expect(hero).toBeVisible()
  })
})
