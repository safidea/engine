import { test, expect } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should render a paragraph', async ({ page }) => {
  // GIVEN
  const text = 'This is a paragraph.'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Paragraph',
            text,
          },
        ],
      },
    ],
  }
  const app = new App()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const paragraphContent = await page.textContent('p')
  expect(paragraphContent).toContain(text)
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display a paragraph in app page', async ({ page }) => {
  // GIVEN
  const text = 'Hello world!'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'paragraph',
        path: '/',
        body: [
          {
            component: 'Paragraph',
            text,
          },
        ],
      },
    ],
  }
  const app = new App()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const paragraphText = await page.textContent('p')
  expect(paragraphText).toBe(text)
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display the paragraph with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Paragraph',
            text: 'hello world',
            id: 'my-paragraph',
          },
        ],
      },
    ],
  }
  const app = new App()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url)

  // THEN
  const paragraph = page.getByText('hello world')
  await expect(paragraph).toHaveAttribute('id')
  expect(await paragraph.getAttribute('id')).toBe('my-paragraph')
  expect(await page.screenshot()).toMatchSnapshot()
})
