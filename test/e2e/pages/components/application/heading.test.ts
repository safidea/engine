import { test, expect, NodeApp } from '@test/fixtures'
import { type Config } from '@latechforce/engine'

test('should render a heading with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'Page',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Heading',
            id: 'my-heading',
            title: { text: 'This is a title' },
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
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  await expect(page.locator('#my-heading')).toBeVisible()
})

test('should redirect when clicking on a link', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'Page',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Heading',
            title: { text: 'This is a title' },
            buttons: [
              {
                label: 'Click me',
                href: 'https://example.com/',
              },
            ],
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)
  await page.getByText('Click me').click()

  // THEN
  expect(page.url()).toBe('https://example.com/')
  expect(await page.screenshot()).toMatchSnapshot()
})
