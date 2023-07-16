import { test, expect } from './fixtures'

test('Page has text hello word', async ({ page, startApp }) => {
  await startApp({
    pages: [
      {
        path: '/',
        components: [
          {
            key: 'div',
            text: 'Hello World!',
          },
        ],
      },
    ],
  })
  await page.goto('/')
  await expect(page.getByText('Hello World!')).toBeVisible()
})

test('Route response message hello world', async ({ request, startApp }) => {
  await startApp({})
  const response = await request.get('/api')
  const { message } = await response.json()
  expect(message).toBe('Hello World!')
})
