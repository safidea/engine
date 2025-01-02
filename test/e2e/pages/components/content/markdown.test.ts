import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should render a markdown component with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            id: 'markdown',
            content: '# This is a markdown content.',
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
  await expect(page.locator('#markdown')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 1 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '# This is a h1 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h1 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H1')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 2 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '## This is a h2 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h2 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H2')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 3 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '### This is a h3 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h3 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H3')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 4 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '#### This is a h4 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h4 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H4')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 5 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '##### This is a h5 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h5 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H5')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Title heading 6 component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: '###### This is a h6 title.',
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
  const title = page.getByRole('heading', { name: 'This is a h6 title.' })
  const heading = await title.evaluate((el) => el.tagName)
  expect(heading).toBe('H6')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Paragraph component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: 'This is a paragraph.',
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
  await expect(page.locator('p')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Divider component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: 'This is a paragraph.\n\n---\n\nThis is another paragraph.',
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
  await expect(page.locator('hr')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Link component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: 'This is [a link](https://example.com).',
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
  await expect(page.locator('a')).toBeVisible()
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should render a markdown with a Image component', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Markdown',
            content: 'This is an ![image](https://picsum.photos/200/300 "Image")',
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
  await expect(page.locator('img')).toBeVisible()
})
