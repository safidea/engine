import { test, expect, NodeApp } from '@test/fixtures'
import App, { type Config } from '@latechforce/engine'

test('should render a link', async ({ page }) => {
  // GIVEN
  const label = 'This is a link.'
  const href = '/about'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Link',
            label,
            href,
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
  const link = page.getByRole('link', { name: label })
  expect(await link.getAttribute('href')).toBe(href)
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display a link in app page', async ({ page }) => {
  // GIVEN
  const label = 'Hello world!'
  const href = '/about'
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'link',
        path: '/',
        body: [
          {
            component: 'Link',
            label,
            href,
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
  const link = page.getByRole('link', { name: label })
  expect(await link.getAttribute('href')).toBe(href)
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display an active link', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'link',
        path: '/',
        body: [
          {
            component: 'Link',
            label: 'Hello world!',
            active: true,
            href: '/about',
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
  const link = page.getByRole('link', { name: 'Hello world!' })
  expect(await link.getAttribute('data-active')).toBe('true')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display an inactive link in the link path page', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'link',
        path: '/about',
        body: [
          {
            component: 'Link',
            label: 'Hello world!',
            active: false,
            href: '/',
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url + '/about')

  // THEN
  const link = page.getByRole('link', { name: 'Hello world!' })
  expect(await link.getAttribute('data-active')).toBe('false')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display an active link in the link path page', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'link',
        path: '/about/me',
        body: [
          {
            component: 'Link',
            label: 'Hello world!',
            href: '/about/me',
          },
        ],
      },
    ],
  }
  const app = new NodeApp()
  const { url } = await app.start(config)

  // WHEN
  await page.goto(url + '/about/me')

  // THEN
  const link = page.getByRole('link', { name: 'Hello world!' })
  expect(await link.getAttribute('data-active')).toBe('true')
  expect(await page.screenshot()).toMatchSnapshot()
})

test('should display the link with id', async ({ page }) => {
  // GIVEN
  const config: Config = {
    name: 'App',
    pages: [
      {
        name: 'Page',
        path: '/',
        body: [
          {
            component: 'Link',
            label: 'hello world',
            href: '/',
            id: 'my-link',
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
  const link = page.getByRole('link', { name: 'hello world' })
  await expect(link).toHaveAttribute('id')
  expect(await link.getAttribute('id')).toBe('my-link')
  expect(await page.screenshot()).toMatchSnapshot()
})
