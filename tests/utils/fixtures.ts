import { test as base, expect } from '@playwright/test'
import Logger from '@tests/logger'

export const test = base.extend({
  page: async ({ page }, use) => {
    const logger = new Logger()
    const log = logger.init('[test]:browser')
    page.on('pageerror', async (exception) => {
      log(exception.message)
    })
    page.on('console', async (msg) => {
      log(msg.text())
    })
    await use(page)
  },
})

export { expect }
