import { test, expect } from './fixtures'

test('First app has text hello word', async ({ page, app }) => {
  await app({ database: { url: 'mongodb://localhost:27017/first' } })
  await page.goto('/')

  await expect(page.getByText('Hello World!')).toBeVisible()
})

test('Second app has text hello word', async ({ page, app }) => {
  await app({ database: { url: 'mongodb://localhost:27017/first' } })
  await page.goto('/')

  await expect(page.getByText('Hello World!')).toBeVisible()
})
