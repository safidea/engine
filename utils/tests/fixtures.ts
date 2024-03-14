import { test as base, expect } from '@playwright/test'
import Logger from '@utils/tests/logger'

export const test = base.extend({
  page: async ({ page }, use) => {
    const logger = new Logger('browser')
    page.on('pageerror', async (exception) => {
      logger.log(exception.message)
    })
    page.on('console', async (msg) => {
      logger.log(msg.text())
    })
    await use(page)
  },
})

export { expect }
