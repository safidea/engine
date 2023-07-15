import { test, expect } from './fixtures'

test('has text hello word', async ({ page, app }) => {
  await app()
  await page.goto('/')

  await expect(page.getByText('Hello World!')).toBeVisible()
})
