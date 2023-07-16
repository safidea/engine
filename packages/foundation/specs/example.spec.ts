import { test, expect } from './fixtures'

test('Page has text hello word', async ({ page, app }) => {
  await app({ database: { provider: 'memory' } })
  await page.goto('/')
  await expect(page.getByText('Hello World !!!')).toBeVisible()
})

test('Route response message hello world', async ({ request, app }) => {
  await app({ database: { provider: 'memory' } })
  const response = await request.get('/api')
  const { message } = await response.json()
  expect(message).toBe('Hello World !!!')
})
