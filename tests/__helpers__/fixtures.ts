import {
  test as base,
  expect,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
  type TestType,
} from '@playwright/test'
import Logger from '@tests/logger'

export type Test = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>

export const test: Test = base.extend({
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
