import { test, expect } from './fixtures'

test('Page has text hello word', async ({ page, app }) => {
  await app({
    pages: {
      '/': {
        components: [
          {
            key: 'div',
            text: 'Hello World!',
          },
        ],
      },
    },
  })
  await page.goto('/')
  await expect(page.getByText('Hello World!')).toBeVisible()
})

test('Route response message hello world', async ({ request, app }) => {
  await app({})
  const response = await request.get('/api')
  const { message } = await response.json()
  expect(message).toBe('Hello World!')
})
